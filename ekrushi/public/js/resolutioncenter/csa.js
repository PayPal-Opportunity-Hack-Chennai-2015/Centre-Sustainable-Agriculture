define([
    'jquery',
    'backbone',
    'resolutioncenter/uploadfiles'
], function ($, Backbone, uploadFiles) {
    'use strict';

    //Hiding the laoding img div once this script is loaded to avoid user clicking the overlays.
    $(document).ready(function(){
        var disputesView = $('#disputesView');
        disputesView.find(".loadingCase").remove();
    });

    var View = Backbone.View.extend({

        el: $('#disputesView'),
        widgetData: {
            previous_id: null,
            current_id: null,
            z_index: '1041'
        },
        popupData: {
            current_id: null,
            z_index: '2041'
        },
        ajaxConf: {
            csrf: $('#csrf').val(),
            url: $('#updateurl').val(),
            method: 'POST'
        },
        uploadConf: {
            files: {},
            currentFlow: null
        },
        fptiData: {
            defaultPage: fpti['page']
        },
        PORData:{
            refundTxns: $('#refundTxns').length > 0 ? $.parseJSON($('#refundTxns').val()) : [],
            selectedTxns: [],
            txnSearch: {
                searchResult: [],
                currentPage: 1,
                pageSize: 10,
                totalPages: null
            }
        },
        userActivities: [],
/*
    Two types of overlay
        - Widget (white ones which slides to left)
        - Popup (dark ones which slides up)
*/
        events: {
            'click a[data-widget], button[data-widget]': 'showWidget',
            'click a[data-popup], button[data-popup]': 'showPopup',
            'click a[data-overlay-close]': 'closeOverlay',
            'click a[data-widget-prev]': 'showPrevWidget',
            'click a[data-call]': 'callMethod',
            'click #searchTransactions' : 'submitSearchTransactions',
            'click #acceptDispute': 'submitAcceptDispute',
            'click input#buyerNotDisputing': 'buyerNotifyLink',
            'change #carrier': 'toggleOtherField',
            'change #item_return': 'showShippingAddress',
            'change #showTrackinginfo': 'trackShipping',
            'change #showOtheroptions': 'otherOptions',
            'keydown': 'onKeyDown',

/*
    Events related to upload - STARTS HERE
        The following methods are defined in resolutioncenter/uploadfiles.js
*/
            'dragover #desktopUploadArea': 'onDragOver',
            'drop #desktopUploadArea': 'onDrop',
            'click .drag-and-drop': 'loadFileDialog',
            'change #desktopUploadControl': 'onFileSelect',
            'click #uploadSubmit': 'ajaxUpldSubmit',
            'click .upload-list a': 'removeFromUploadList',
            'click .dropdown-menu li a': 'showShipping',
            'click .toggle-view a': 'toggleView',
/*
    Events related to upload - ENDS HERE
*/
        },
        initialize: function () {
            _.extend(this, uploadFiles);
            $('.overlay').keydown(this.onKeyDown);
        },
        buyerNotifyLink: function(){
            if ($("#buyerNotDisputing").is(':checked')) {
                $('#buyerNotify').addClass("checkboxChecked");
            }
            else{
                $('#buyerNotify').removeClass("checkboxChecked");
            }
        },
        showShipping: function(e){

            //alert("value"+$(e.target).attr('data-value'));
            //  alert($(e.target).parents(".input-group-btn"));
            $(e.target).parents(".input-group-btn").find('.btn').html($(e.target).text());
            $(e.target).parents(".input-group-btn").find('.btn').val($(e.target).attr('data-value'));

            this.toggleOtherField();

        },
        trackShipping: function(){
            this.resetErrors();
            if($('#showTrackinginfo').is(':checked')){
                $('#trackLabel').removeClass('hide').addClass('show');
             //   $('#carrierType').removeClass('hide').addClass('show');
                $('#shippingCarrierType').removeClass('hide').addClass('show');
                $('#uploadFileSection').removeClass('hide').addClass('show');
                $('#DisabledSubmit').addClass('hide');
            }

            if($("#carrierValue").val()=="OTHER"){
                var that = this;
                that.toggleOtherField();
            }
        },
        showShippingAddress: function(){
            if($('#item_return').is(':checked')){
                $('#showShipping').removeClass('hide').addClass('show');
            }else{
                $('#showShipping').removeClass('show').addClass('hide');
            }
        },
        otherOptions: function(){
            this.resetErrors();
            if($('#showOtheroptions').is(':checked')){
                $('#trackLabel').removeClass('show').addClass('hide');
              //  $('#carrierType').removeClass('show').addClass('hide');
                $('#shippingCarrierType').removeClass('show').addClass('hide');
                $('#uploadFileSection').removeClass('hide').addClass('show');
                $("#otherCarrier").addClass('hide');
                $('#DisabledSubmit').addClass('hide');
           }
        },
        toggleOtherField: function (){
        //    alert($("#carrierValue").val());
            if($("#carrierValue").val()=="OTHER"){
                $("#otherCarrier").removeClass('hide');
                $("#otherCarrier").removeClass('validationFailed');
            } else {
                $("#otherCarrier").addClass('hide');
            }

        },
        showWidget: function (e) {
/*
            - reset the validation errors across all overlays
            - get the id of the next overlay
            - increase the z-idx to 1042 of the next overlay
            - change the position to left 100%
            - show the next overlay
            - animate to left 0
            - update the prev with current value
            - hide the previous overlay
            - update the current with the new value
            - change the z-idx to normal widget value
*/
            this.resetErrors();
            var widget = e.id || $(e.target).attr('data-widget') || $(e.currentTarget).attr('data-widget'),
                zIdx = this.widgetData.z_index,
                that = this;

            var postOpen = function () {
                var docBody = $('body');
                that.widgetData.previous_id = that.widgetData.current_id;
                if (that.widgetData.previous_id) {
                    $('#' + that.widgetData.previous_id).modal('hide');
                }
                that.widgetData.current_id = widget;
                $('#' + widget).css({
                    'z-index': ''
                });
                docBody.css({
                    'overflow': 'hidden'
                });
                that.trackOverlays(widget);
                that.userActivities.push("User opened " + widget + " widget");
            };
            $('#' + widget).css({
                    'z-index': zIdx + 1,
                    'left': '100%'
                }).modal({
                    'backdrop':'static',
                    'keyboard': false,
                    'show':true
                }).animate({
                    'left': '0'
                }, 300, 'swing', postOpen);
        },
        showPopup: function (e) {
            var popup = e.id || $(e.target).attr('data-popup');
            var zIdx = this.popupData.z_index;
            var that = this;

            var postOpen = function () {
                that.popupData.current_id = popup;
                $('#' + popup).css({
                    'z-index': ''
                });
                $('body').css({
                    'overflow': 'hidden'
                });
                that.userActivities.push("User opened " + popup + " popup");
                that.trackOverlays(popup);
            };
            $('#' + popup).css({
                    'z-index': zIdx + 1,
                    'top': '100%'
                }).modal({
                    'backdrop':'static',
                    'keyboard': false,
                    'show':true
                }).animate({
                    'top': '0'
                }, 300, 'swing', postOpen);
        },
        trackOverlays: function (overlay) {
            if(overlay) {
                var ePQ = fpti['page'],
                    ePQArr =[];
                if (ePQ) {
                    ePQArr = ePQ.split(':');
                    ePQArr.pop();
                }
                if (overlay === 'uploadFile') {
                    ePQArr.push(this.uploadConf.currentFlow + '-' + overlay);
                } else {
                    ePQArr.push(overlay);
                }
                fpti['page'] = fpti['pgrp'] = ePQArr.join(":");
            } else {
                fpti['page'] = fpti['pgrp'] = this.fptiData.defaultPage;
            }

            PAYPAL.analytics.instance.recordClick();
        },
        closeOverlay: function () {
/*
            - slide down the current overlay
            - hide the modal
            - change the css top to 0
            - update the widget & popup current to null
*/
            var overlay = this.popupData.current_id || this.widgetData.current_id;

            // Set focus on Respond to Dispute or Close with Refund Button if the current overlay is sendproof
            if(overlay === 'sendProof'){
                var tmpEl= $('[data-widget="sendProof"]') || $('[data-widget="caseCloseRefund"]');
                tmpEl.focus();
            }

            var that = this;
            var postClose = function () {
                $('#' + overlay).modal('hide').css({'top': '0'});
                $('body').css({
                    'overflow': ''
                });
                if (that.popupData.current_id) {
                    that.popupData.current_id = null;
                } else {
                    that.widgetData.current_id = null;
                }
                if(that.popupData.current_id === null && that.widgetData.current_id === null) {
                    that.trackOverlays();
                }
                that.userActivities.push("User closed " + overlay + " overlay");
            };
            $('#' + overlay).animate({
                'top': '100%'
            }, 300, 'swing', postClose);
        },
        showPrevWidget: function (e) {
/*
            - chage the z-idx of the prev to -1
            - show the prev overlay
            - slide the current one left
            - revert left for current
            - hide the current one
            - chage the z-idx of the prev to normal
            - update the current id
*/
            var prevWidget = $(e.target).attr('data-widget-prev'),
                currentWidget = this.widgetData.current_id,
                zIdx = this.widgetData.z_index,
                that = this;
            var postShowPrev = function () {
                $('#' + currentWidget).css({
                    'left': ''
                }).modal('hide');
                $('#' + prevWidget).css({
                    'z-index': ''
                });
                that.widgetData.current_id = prevWidget;
                that.trackOverlays(prevWidget);
                that.userActivities.push("User moved back to  " + prevWidget + " widget");
            };

            $('#' + prevWidget).css({
                    'z-index': zIdx - 1
                }).modal({
                    'backdrop':'static',
                    'keyboard': false,
                    'show':true
                });
            $('#' + currentWidget).animate({
                    'left': '100%'
                }, 300, 'swing', postShowPrev);

            if(prevWidget === 'sendProof'){
                $('a[data-widget="'+currentWidget+'"]').focus();
            }

        },
        toggleView: function (e) {
            var tvEl = $(e.target).parent().parent(),
                showEls = tvEl.find('.hide');

            tvEl.find('> *').addClass('hide');
            showEls.removeClass('hide');
        },
        callMethod: function (e) {
            var cMethod = $(e.target).data('call') || $(e.currentTarget).data('call'),
                cMethodArr;
            if (cMethod) {
                cMethodArr = cMethod.split(':');
                for (var i = 0; i < cMethodArr.length; i++) {
                    if (cMethodArr[i]) {
                        this[cMethodArr[i]](e);
                    }
                }
            }
        },
        showLoader: function (el) {
            if (!el) {
                el = '#' + this.widgetData.current_id;
            }
            var lEl = $(el),
                height = lEl.css('height');
            lEl.append('<div class="loading" style="height:' + height + '"></div>');
        },
        hideLoader: function (el) {
            if (!el) {
                el = '#' + this.widgetData.current_id;
            }
            var lEl = $(el);
            lEl.find(".loading").remove();
        },
        ajaxSubmit: function (conf, data, callback) {
            var that = this,
                formData = null,
                err = null,
                dataKey,
                submitType = (conf && conf.method) ? conf.method : this.ajaxConf.method,
                loaderEl = conf && conf.loaderEl ? conf.loaderEl : null;

            if(data.action){
                this.userActivities.push("User clicks on " + data.action);
            }


            if (submitType === 'POST') {
                formData = new FormData();
                formData.append('_csrf', this.ajaxConf.csrf);
                formData.append('activitiesData', this.userActivities);
                for (dataKey in data) {
                    formData.append(dataKey, data[dataKey]);
                }
            } else if (submitType === 'GET') {
                formData = $.param(data);
            }
            this.showLoader(loaderEl);

            $.ajax({
                url: (conf && conf.url) ? conf.url : this.ajaxConf.url,
                type: submitType,
                data: formData,
                processData: false,
                contentType: false,
            }).done(function (response) {
/*
    - if there is no response fail gracefully
    - check if response has an error sent from underlying application components (response.err)
*/
                that.resetUserActivity();
                that.hideLoader(loaderEl);
                that.resetErrors();
                if (response) {
                    if (response.err) {
                        err = response.err;
                    } else if (response.redirect) {
                        window.location.replace(response.redirect);
                        return;
                    }
                }
                callback(err, response);
            }).fail(function (response) {
                var serviceErrors = [],
                    serviceError = {
                        "dummyField" : ["SERVICEERR_001"]
                    };
                serviceErrors.push(serviceError);
                response.err = {
                    "errorType": "serviceFailure",
                    "errorList": serviceErrors
                };
                that.resetUserActivity();
                that.hideLoader(loaderEl);
                callback('Failed', response);
            });

        },
        resetUploadFlow: function () {
            var cFlow = this.uploadConf.currentFlow;

            if (!this.uploadConf.files[cFlow]) {
                this.uploadConf.files[cFlow] = {};
            }
        },
        getUploadDocType: function () {
            var retVal = "";
            switch (this.uploadConf.currentFlow) {
                case 'proofOfShipment':
                    retVal = 'Proof of Shipping';
                    break;
                case 'otherProofOfRefund':
                    retVal = 'Proof of Refund';
                    break;
                case 'otherProof':
                    retVal = 'Other';
                    break;
                case 'sellerAppeal':
                    retVal = 'SellerAppeal';
                    break;
            };
            return retVal;
        },
        resetUserActivity: function(){
            this.userActivities = [];
        },
        initiatePOS: function () {
            this.uploadConf.currentFlow = 'proofOfShipment';
            this.resetUploadFlow();
        },
        initiateOtherPOR: function () {
            this.uploadConf.currentFlow = 'otherProofOfRefund';
            this.resetUploadFlow();
        },
        initiateOtherProof: function () {
            this.uploadConf.currentFlow = 'otherProof';
            this.resetUploadFlow();
        },
        initiateSellerAppeal: function () {
            this.uploadConf.currentFlow = 'sellerAppeal';
            this.resetUploadFlow();
        },
        initiateAdditionalInfo: function () {
            this.uploadConf.currentFlow = 'additionalInfo';
            this.resetUploadFlow();
        },
        submitPOS: function () {
            var that = this;
            var cFlow = this.uploadConf.currentFlow,
                submitPOSFrm = $('#submit_proof_of_shipment'),
                data = {
                    'action': 'submitPOS',
                    'disputeCategory': $('#disputeCategory').val(),
                    'isConsumer':$('#isConsumer').val(),
                    'uploadDocType': this.getUploadDocType(),
                    'trackingNumber' : submitPOSFrm.find('#trackingNumber').val() || '',
                    'carrier' : submitPOSFrm.find('#carrierValue').val() || '',
                    'otherCarrier': submitPOSFrm.find('#otherCarrier').val() || '',
                    'comments': submitPOSFrm.find('#POSComments').val() || ''
                };

            _.extend (data, this.uploadConf.files[cFlow]);
            this.ajaxSubmit(null, data, function (err, response) {
               if(response.err){
                    if(response.err.errorType === 'serviceFailure'){
                        that.closeOverlay();
                        that.showErrors('casedetails', response.err);
                    }else{
                        that.showErrors('proofOfShipment',response.err);
                    }
                }else{
                    that.resetUploadFlow();
                    $('#paypalResponseDate').html(response.paypalResponseDate);
                    that.showWidget({
                        id: "proofOfFulfillmentThanksPage"
                    });
                }
            });
        },
        submitPOR: function () {
            var that = this;
            var PORDiv = $('#selectedRefundTxns');
            var refundedTransactionIds = PORDiv.find("input[id=refundedTxns]:checked").map(function() {
                return this.value;
            }).get();
            var data = {
                'action': 'submitPOR',
                'disputeCategory': $('#disputeCategory').val(),
                'isConsumer':$('#isConsumer').val(),
                'refundedTransactionIds' : refundedTransactionIds
            };
            this.ajaxSubmit(null, data, function (err, response) {
                if(response.err){
                    if(response.err.errorType === 'serviceFailure'){
                        that.closeOverlay();
                        that.showErrors('casedetails', response.err);
                    }else{
                        that.showErrors('submitProofOfRefund',response.err);
                    }
                }else{
                    $('#paypalResponseDate').html(response.paypalResponseDate);
                    that.showWidget({
                        id: "thanksPage"
                    });
                }
            });
        },
        submitPORSearch: function () {
            var that = this;
            var PORSearchDiv = $('#proofOfRefundSearchTransactions');
            var refundedTransactionIds = PORSearchDiv.find("input[id=transactionIds]:checked").map(function() {
                return this.value;
            }).get();
            var data = {
                'action': 'submitPORSearch',
                'disputeCategory': $('#disputeCategory').val(),
                'isConsumer':$('#isConsumer').val(),
                'refundedTransactionIds' : refundedTransactionIds
            };
            this.ajaxSubmit(null, data, function (err, response) {
                if(response.err){
                    that.showErrors(PORSearchDiv.attr('id'),response.err);
                }else{
                    $('#paypalResponseDate').html(response.paypalResponseDate);
                    that.showWidget({
                        id: "thanksPage"
                    });
                }
            });
        },
        submitOtherPOR: function () {
            var cFlow = this.uploadConf.currentFlow,
                data = {
                    'action': 'submitOtherPOR',
                    'disputeCategory': $('#disputeCategory').val(),
                    'isConsumer':$('#isConsumer').val(),
                    'uploadDocType': this.getUploadDocType(),
                    'comments': $('#otherPORComments').val() || ''
                },
                that = this;
            //make a ajax call only if user has uploaded a file
            if (!this.uploadConf.files[cFlow]) {
                _.extend (data, this.uploadConf.files[cFlow]);
                this.ajaxSubmit(null, data, function (err, response) {
                    if(response.err){
                        if(response.err.errorType === 'serviceFailure'){
                            that.closeOverlay();
                            that.showErrors('casedetails', response.err);
                        }else{
                            that.showErrors('otherProofOfRefund',response.err);
                        }
                    }else{
                        that.resetUploadFlow();
                        $('#paypalResponseDate').html(response.paypalResponseDate);
                        that.showWidget({
                            id: "thanksPage"
                        });
                    }
                });
            }else{
                that.showErrors(cFlow, {'errorList': [{"upload-area": ["COMMON_001"]}]});
            }
        },
        submitOtherProof: function () {
            var that = this,
                cFlow = this.uploadConf.currentFlow,
                data = {
                    'action': 'submitOtherProof',
                    'disputeCategory': $('#disputeCategory').val(),
                    'isConsumer':$('#isConsumer').val(),
                    'uploadDocType': this.getUploadDocType(),
                    'comments': $('#otherProofComments').val() || ''
                };
            _.extend (data, this.uploadConf.files[cFlow]);
            this.ajaxSubmit(null, data, function (err, response) {
                if(err){
                    if(response.err.errorType === 'serviceFailure'){
                        that.closeOverlay();
                        that.showErrors('casedetails', response.err);
                    }else{
                        that.showErrors('otherProof',response.err);
                    }
                }else{
                    that.resetUploadFlow();
                    $('#paypalResponseDate').html(response.paypalResponseDate);
                    that.showWidget({
                        id: "thanksPage"
                    });
                }
            });
        },
        reloadCaseDetails: function() {
            location.reload();
        },
        showErrors: function(context,errors){
            $('#'+context).find('#errorMessages').removeClass("hide");
            //Iterate the error object
            //Add red alert class for the input fields failed validation
            //Unhide the error message related to the validation error
            $('#'+context).find('#errorMessages').removeClass("hide");
            this.userActivities.push("User action " + context + " failed ");
            _.each(errors.errorList,function(value, key) {
                 _.each(value,function(errorMessages, fieldId) {
                    $('#'+context).find('#' + fieldId).addClass("validationFailed");
                    _.each(errorMessages,function(errorMessage, key) {
                        $('#'+context).find('#' + errorMessage).removeClass("hide");
                    });
                });
            });
        },
        resetErrors: function(){
            var overlay = this.popupData.current_id || this.widgetData.current_id;
            $('#'+overlay).find('#errorMessages').addClass("hide");
            $('#errorMessages p').addClass("hide");
            $('#errorMessages').addClass("hide");
            $( '.validationFailed').removeClass("validationFailed");
        },
        submitSearchTransactions : function(e) {
/*
            - format the template to display in the search result table
            - form the required query parameters
            - fire the AJAX HTTP GET request
            - render the search table with the service response
*/

            //localized content to be displayed in the search table
            var moneySentTo = $('#moneySentTo').html(),
                caseId = "",
                that = this;

            var data = {};
            this.userActivities.push("User is searching transaction with property: " + $('#filterProperty').val() + " and value: " + $('#filterValue').val());
            caseId = $('#updateurl').val().substring(29, $('#updateurl').val().indexOf("/update"));
            if($('#filterValue').val().length > 0){
                data = {
                    "caseId":caseId,
                    "activitiesData":this.userActivities,
                    "filterProperty" : $('#filterProperty').val(),
                    "filterValue" : $('#filterValue').val(),
                    "txnDateTime" : $('#txnDateTime').val()
                };
            }else{
                return;
            }

            var ajaxConf = {
                'url': $('#searchTrasactionsUrl').val(),
                'method': 'GET'
            };

            this.PORData.txnSearch.currentPage = 1;
            this.ajaxSubmit(ajaxConf, data, function (err, result) {
                if(err){
                    that.showErrors('proofOfRefundSearchTransactions',result.err);
                }else{
                    $('#transactionSearchResultArea').removeClass("hide");
                    $('#searchResult').find('#results').empty();
                    if(result && Object.keys(result).length === 0){
                        this.userActivities.push("User search returned no rows.");
                        $('#searchResult').find('#noResults').removeClass("hide");
                    }else{
                        this.PORData.txnSearch.searchResult= result;
                        $('#searchResult').find('#results').append($('<ul class="searchList"/>'));
                        this.showSearchResults();
                    }
                }
            });
        },
        showSearchResults: function(){
            var moneySentTo = $('#moneySentTo').html()
            var resultTemplate = "" +
            "        <% _.each(paymentActivities,function(paymentActivity){ %>" +
            "            <li><span><input id='transactionIds' type='checkbox' value='<%= paymentActivity.transactionId %>'/></span>" +
            "                <span><%= paymentActivity.createdDate %></span>" +
            "                <span class='sentto-column'>" + moneySentTo + " <%= paymentActivity.counterpartyFullName %></span>" +
            "                <span class='amount'>-<%= paymentActivity.grossAmount %></span>" +
            "            </li>" +
            "        <% }); %>";

            $('#searchResult').find('#noResults').addClass("hide");
            var currentPage= this.PORData.txnSearch.currentPage;
            var searchResult= this.PORData.txnSearch.searchResult;
            var pageSize= this.PORData.txnSearch.pageSize;

            var showFrom = pageSize * (currentPage - 1);
            var showTo = ((showFrom + pageSize) >= searchResult.length) ? searchResult.length : (showFrom + pageSize);
            var template = _.template(resultTemplate,{paymentActivities : searchResult.slice(showFrom,showTo)});
            var searchList= $('#searchResult #results .searchList');
            searchList.append(template);

            var hasMore = (showTo<searchResult.length) ? true : false;

            if(hasMore){
                $('#showMore').removeClass("hide");
            }else{
                $('#showMore').addClass("hide");
            }

        },
        showMoreResults: function(){
            this.PORData.txnSearch.currentPage += 1;
            this.showSearchResults();
        },
        issueRefund: function(e){
            var that = this,
                data = {
                    'action':'issueRefund',
                    'disputeCategory': $('#disputeCategory').val()
                },
                ajaxConf = {
                    url: $('#accepturl').val(),
                    method: 'POST'
                };

            if($('#item_return').is(':checked') && $('#shippingAddValue').val() != "" ){
                data['shippingAddress'] = $('#shippingAddValue').val();
                data['setReturnNoteText'] = 'true';
            }
            this.ajaxSubmit(ajaxConf, data, function (err, result) {
                if(err){
                    if(result.err.errorType === 'serviceFailure'){
                        that.closeOverlay();
                        that.showErrors('casedetails', result.err);
                    }else{
                        that.showErrors('caseCloseRefund',result.err);
                    }
                }else{
                    that.showWidget({
                        id: "caseClose"
                    });
                }
            });
        },
        submitBuyerNotification: function () {
            var that = this;
            var cFlow = this.uploadConf.currentFlow,
                data = {
                    'action': 'submitBuyerNotification',
                    'disputeCategory': $('#disputeCategory').val()
                },
                ajaxConf = {
                    url: $('#cancelurl').val(),
                    method: 'POST',
                    loaderEl:'body'
                };

            that.ajaxSubmit(ajaxConf, data, function (err, response) {
                if(err || response.err)
                {
                    console.log(err);
                    that.showErrors('casedetails',err);
                }
                else
                {
                    that.showWidget({
                            id: "thanksPage"
                        });
                }
            });
        },
        showSelectedTxns: function(e){
            this.PORData.selectedTxns= [];
            var totalRefund= 0.0;
            var currency;
            var PORDiv;
            var refundedTransactionIds;
            var refundRelatedTxns;
            var PORflow= $(e.target).attr('flow');
            if(PORflow == 'refund'){
                PORDiv = $('#proofOfRefund');
                refundRelatedTxns= this.PORData.refundTxns;
            }else if(PORflow == 'search'){
                PORDiv = $('#proofOfRefundSearchTransactions');
                refundRelatedTxns= this.PORData.txnSearch.searchResult;
            }

            var refundedTransactionIds = PORDiv.find("input[id=transactionIds]:checked").map(function() {
                return this.value;
            }).get();

            if(refundedTransactionIds.length === 0){
                //Validating if the user has selected any one of the transaction.
                return;
            }

            for (var i = 0; i < refundedTransactionIds.length; i++) {
                //filters the refunded txns with the selected transaction id.
                var txnID= refundedTransactionIds[i];
                var selectedTxn = _.find(refundRelatedTxns, function(refundTxn){
                    return refundTxn.transactionId.indexOf(txnID) !== -1;
                });
                totalRefund+=  parseFloat(selectedTxn.amount.value);
                //Initalizing currencyCode only for the first loop
                if(i==0){
                    currency= selectedTxn.amount.currencyCode;
                }
                this.PORData.selectedTxns.push(selectedTxn);
            }
            //localized content to be displayed in the search table
            var moneySentTo = $('#moneySentTo').html(),
                caseId = "",
                that = this;

            var resultTemplate = "" +
            "    <ul class='searchList'>" +
            "        <% _.each(paymentActivities,function(paymentActivity){ %>" +
            "            <li><span><input id='refundedTxns' type='checkbox' checked value='<%= paymentActivity.transactionId%>'/></span>" +
            "                <span><%= paymentActivity.createdDate %></span>" +
            "                <span class='sentto-column'>" + moneySentTo + " <%= paymentActivity.counterpartyFullName %></span>" +
            "                <span class='amount'>-<%= paymentActivity.grossAmount %></span>" +
            "            </li>" +
            "        <% }); %>" +
            "    </ul>";
            var template = _.template(resultTemplate,{paymentActivities : this.PORData.selectedTxns});
            $('#selectedRefundTxns').html(template);
            $('#totalRefund').html('' + currency + totalRefund);
            this.showWidget({
                id: "submitProofOfRefund"
            });
        },
        onKeyDown: function(e){
            var keycode = ((typeof e.keyCode !='undefined' && e.keyCode) ? e.keyCode : e.which);
            if (keycode === 27) {
                this.closeOverlay();
            };
        }
    });

    return View;
});
