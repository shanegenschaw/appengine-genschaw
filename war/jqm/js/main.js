var myjs = myjs || {};

(function (jQuery, myjs) {
    
    var monthNames_MMM = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dayNames_EEE = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    /** Date format utility. */
    var formatDateMMDDYYYY = function (millis) {
        var theDate = new Date(millis);
        var formatted = (theDate.getMonth() + 1) + "/" + theDate.getDate() + "/" + theDate.getFullYear();
        return formatted;
    };
    
    /** Date format utility. */
    var formatDateMMMDD = function (millis) {
        var theDate = new Date(millis);
        var formatted = monthNames_MMM[theDate.getMonth()] + " " + theDate.getDate();
        return formatted;
    };
    
    var formatDateEEEMMMDD = function (millis) {
        var theDate = new Date(millis);
        var formatted = dayNames_EEE[theDate.getDay()] + " " + monthNames_MMM[theDate.getMonth()] + " " + theDate.getDate();
        return formatted;
    };
    
    var formatDollar = function (amount) {
        return "$" + Number(amount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    };
    
    var trimOnBlurHandler = function () {
        var self = jQuery(this);
        self.val(jQuery.trim(self.val()));
    };
    
    var servicedAccounts = [];
    
    var ServicedAccount = function (data) {
        this.data = data;
        this.index = data.index;
        this.requestedPaymentAmount = data.paymentSuggested ? data.amountDue : 0;
        this.paymentRequested = data.paymentSuggested;
    };
    
    ServicedAccount.prototype.isPaymentRequestedWithAmount = function () {
        return this.paymentRequested && this.requestedPaymentAmount > 0;
    };
    
    ServicedAccount.prototype.togglePaymentDetailsRow = function () {
        if (this.isPaymentRequestedWithAmount()) {
            jQuery("#makePmtAcctrow" + this.index).show();
        } else {
            jQuery("#makePmtAcctrow" + this.index).hide();
        }
    };
    
    ServicedAccount.prototype.setPaymentRequested = function (value) {
        this.paymentRequested = value;
        if (this.paymentRequested) {
            jQuery("#acctlistPayamtFieldset" + this.index).slideDown();
        } else {
            jQuery("#acctlistPayamtFieldset" + this.index).slideUp();
        }
        this.togglePaymentDetailsRow();
    };
    
    ServicedAccount.prototype.setRequestedPaymentAmount = function (newamountStr) {
        this.requestedPaymentAmount = parseFloat(newamountStr);
        var newValue = formatDollar(newamountStr);
        jQuery("#makePmtPayamt" + this.index).text(newValue);
        this.togglePaymentDetailsRow();
    };
    
    var refreshPaymentTotal = function () {
        var total = 0.00;
        var i = 0;
        var stop = servicedAccounts.length;
        var nrOfAcctsToPay = 0;
        while (i < stop) {
            if (servicedAccounts[i].isPaymentRequestedWithAmount()) {
                total = total + servicedAccounts[i].requestedPaymentAmount;
                nrOfAcctsToPay = nrOfAcctsToPay + 1;
            }
            i = i + 1;
        }
        //hidden form input used for validation
        jQuery("#paytot").val(Number(total).toFixed(2));
        //updating total listed on each page
        var totalTx = formatDollar(total);
        jQuery("#acctlistPaytot").text(totalTx);
        jQuery("#makePmtPaytot").text(totalTx);
        jQuery("#pmtSubmittedPaytot").text(totalTx);
        jQuery("#acctlistNrOfAccts").text(nrOfAcctsToPay);
        jQuery("#acctlistNrOfAcctsLabel").text((nrOfAcctsToPay === 1) ? "Account" : "Accounts");
        //jQuery("#pmtSubmittedMsgPaytot").text("$" + total);
        return total;
    };
    
    var refreshPaymentDate = function (enable) {
        var paymentDateSelect = jQuery("#paymentDateSelect");
        var currentlyDisabled = paymentDateSelect.attr("disabled");
        if (enable && currentlyDisabled) {
            paymentDateSelect.selectmenu();
            paymentDateSelect.selectmenu("enable");
            paymentDateSelect.selectmenu("refresh");
        } else if (!enable && !currentlyDisabled) {
            paymentDateSelect.selectmenu();
            var pdSelect = paymentDateSelect[0];
            pdSelect.selectedIndex = 0;
            paymentDateSelect.selectmenu("disable");
            paymentDateSelect.selectmenu("refresh");
            window.alert("Your payment date has been defaulted to the next available business date because the payment option you selected has accrued interest in its calculation.");
        }
    };
    
    ServicedAccount.prototype.applyIndicators = function () {
        var notifySelector = "#notify-area";
        if (this.data.pastDueFlag) {
            jQuery(notifySelector + " .pastdue").show();
        }
        if (this.data.autoPayFlag) {
            jQuery(notifySelector + " .autopay").show();
        }
        if (this.data.paidAheadFlag) {
            jQuery(notifySelector + " .paidahead").show();
        }
        if (this.data.scheduledPaymentsFlag) {
            jQuery(notifySelector + " .pmtscheduled").show();
        }
    };
    
    ServicedAccount.prototype.buildAcctlistItem = function () {
        var self = this;
        var li = jQuery("<li>", {
            "id": "acctlist-item" + this.index,
            "class": "acct-li"
        });
        
        var h3 = jQuery("<h3>");
        h3.append('<div class="loanTypeList text-wrap">' + this.data.loanType + '</div>')
        var notifyArea = jQuery("<div>", { "class": "notify-area" });
        if (this.data.pastDueFlag) {
            notifyArea.append('<div class="pastdue">pd</div>');
        }
        if (this.data.autoPayFlag) {
            notifyArea.append('<div class="autopay">ap</div>');
        }
        if (this.data.paidAheadFlag) {
            notifyArea.append('<div class="paidahead">pa</div>');
        }
        if (this.data.scheduledPaymentsFlag) {
            notifyArea.append('<div class="pmtscheduled">ps</div>');
        }
        notifyArea.appendTo(h3);
        h3.appendTo(li);
        
        jQuery("<p>", { "class": "text-wrap" }).html(this.data.lenderName + " (" + this.data.lenderNumber + ")").appendTo(li);
        
        var statusLine = jQuery("<p>", { "class": "text-wrap" });
        statusLine.html(this.data.status + " | ");
        if (this.data.amountDue === 0 && !this.data.autoPayFlag) {
            statusLine.append("No Payment Due");
        } else {
            statusLine.append("Due " + formatDateMMMDD(this.data.dueDate));
        }
        statusLine.appendTo(li);
        
        // build the "Pay This Account" checkbox and label
        var checkboxInput = jQuery("<input>", {
            "type": "checkbox",
            "name": "acctlistPaytoggle" + this.index,
            "id": "acctlistPaytoggle" + this.index,
            "data-theme": "c",
            "checked": this.isPaymentRequestedWithAmount()
        });
        checkboxInput.change(function () {
            self.setPaymentRequested(jQuery(this).attr("checked"));
            refreshPaymentTotal();
        });
        var checkboxLabel = jQuery("<label>", { "for": "acctlistPaytoggle" + this.index });
        checkboxLabel.html("Pay This Account");
        // wrap them in a span and fieldset
        var checkboxSpan = jQuery("<span>", { "class": "generic-btn-b" });
        checkboxInput.appendTo(checkboxSpan);
        checkboxLabel.appendTo(checkboxSpan);
        var checkboxFieldset = jQuery("<fieldset>", { "data-role": "fieldcontain" });
        checkboxSpan.appendTo(checkboxFieldset);
        var html = "";

        // build the "Payment Amount" input and label
        var amountLabel = jQuery("<label>", { "for": "acctlistPayamt" + this.index });
        amountLabel.html("Payment Amount");
        var amountInput = jQuery("<input>", {
            "type": "number",
            "name": "acctlistPayamt" + this.index,
            "id": "acctlistPayamt" + this.index,
            "class": "payamount",
            "value": "0",
            "data-glvalidate-type": "pattern paymentamount",
            "data-glvalidate-paymentamount-param": "[" + this.data.principalBalance + ", " + this.data.totalBalance + "]",
            "data-glvalidate-paymentamount-callback-param": this.data.totalBalance,
            "data-glvalidate-paymentamount-message": "Your requested payment is greater than or equal to your unpaid principal.  Do you wish to pay off this account?",
            "data-glvalidate-pattern-param": "^\\d*\\.\\d{2}$|^\\d*$",
            "data-glvalidate-pattern-message": "Payment Amount is invalid.  Please enter a valid dollar amount."
        });
        // attach handlers
        amountInput.blur(function () {
            var elem = jQuery(this);
            if (elem.val() === '') {
                elem.val(0);
            }
            var paymentAmt = parseFloat(elem.val());
            if (paymentAmt >= self.data.totalBalance) {
                if (window.confirm("Your requested payment is greater than or equal to your unpaid principal.  Do you wish to pay off this account?")) {
                    elem.val(self.data.totalBalance.toFixed(2));
                } else {
                    elem.val("0.00");
                }
            }
            self.setRequestedPaymentAmount(elem.val());
            elem.val(Number(elem.val()).toFixed(2));
            if (self.requestedPaymentAmount === self.data.totalBalance) {
                refreshPaymentDate(false);
            }
            refreshPaymentTotal();
        });
        
        
        // wrap them in a fieldset
        var amountFieldset = jQuery("<fieldset>", { "id": "acctlistPayamtFieldset" + this.index, "data-role": "fieldcontain" });
        amountFieldset.append('<div class="field-error" id="acctlistPayamt' + this.index + 'Error"></div>');
        amountLabel.appendTo(amountFieldset);
        amountInput.appendTo(amountFieldset);
        
        // wrap the fieldsets with a div and add to the list item
        var fieldsDiv = jQuery("<div>", { "class": "fields" });
        checkboxFieldset.appendTo(fieldsDiv);
        amountFieldset.appendTo(fieldsDiv);
        fieldsDiv.appendTo(li);

        // empty anchor to show split list button
        jQuery("<a>").appendTo(li);
        var detailsLink = jQuery("<a>", { "href": "#acctdet", "class": "detailsLink" });
        detailsLink.bind("click", function () {
            self.fillDetailsPage();
            return true;
        });
        detailsLink.appendTo(li);
        return li;
    };
    
    ServicedAccount.prototype.fillDetailsPage = function () {
        
        jQuery("#acctdet .acctsummary h3").html(this.data.loanType);
        if (this.data.endorserView && this.data.borrowerName) {
            jQuery("#acctdet .acctsummary h2").html("for " + this.data.borrowerName);
            jQuery("#acctdet .acctsummary h2").show();
        } else {
            jQuery("#acctdet .acctsummary h2").hide();
        }
        jQuery("#acctdet .acctsummary .lender").html(this.data.lenderName + " (" + this.data.lenderNumber + ")");
        
        var detailNotifySelector = "#acctdet-notify-area ";
        if (this.data.autoPayPendingFlag) {
            var autoPayDate = formatDateMMDDYYYY(this.data.autoPayPendingDate);
            jQuery(detailNotifySelector + ".autopayLabel .autopayDate").html(autoPayDate);
            jQuery(detailNotifySelector + ".autopayLabel").show();
        } else {
            jQuery(detailNotifySelector + ".autopayLabel").hide();
        }
        if (this.data.pastDueFlag) {
            jQuery(detailNotifySelector + ".pastdue").show();
        } else {
            jQuery(detailNotifySelector + ".pastdue").hide();
        }
        if (this.data.autoPayFlag) {
            jQuery(detailNotifySelector + ".autopay").show();
        } else {
            jQuery(detailNotifySelector + ".autopay").hide();
        }
        if (this.data.paidAheadFlag) {
            jQuery(detailNotifySelector + ".paidahead").show();
        } else {
            jQuery(detailNotifySelector + ".paidahead").hide();
        }

        var schdpmtsGrid = jQuery("#acctdet-schdpmts .ui-grid-a");
        schdpmtsGrid.html("");
        if (this.data.unprocessedPayments) {
            jQuery.each(this.data.unprocessedPayments, function (index, pmt) {
                var paymentDate = formatDateMMDDYYYY(pmt.payOnDate);
                var formattedAmt = formatDollar(pmt.paymentAmount);
                var html = "<div class='ui-block-a'>Date: " + paymentDate + "</div>";
                html = html + "<div class='ui-block-b'>Amount: " + formattedAmt + "</div>";
                jQuery(html).appendTo(schdpmtsGrid);
            });
        }
        
        if (this.data.scheduledPaymentsFlag) {
            jQuery(detailNotifySelector + ".pmtscheduled").show();
            jQuery("#acctdet #acctdet-schdpmts").show();
        } else {
            jQuery(detailNotifySelector + ".pmtscheduled").hide();
            jQuery("#acctdet #acctdet-schdpmts").hide();
        }
        
        
        var summaryDueAmtAndDate = jQuery("#acctdet-summaryDueAmtAndDate");
        if (this.data.displaySummaryDueAmtAndDate) {
            var val = formatDollar(this.data.amountDue);
            var label = "Amount Due by " + formatDateMMMDD(this.data.dueDate);
            if (this.data.autoPayFlag && !this.data.pastDueFlag) {
                label = "Next Auto Pay Withdrawal on " + formatDateMMMDD(this.data.dueDate);
                val = formatDollar(this.data.autoPaymentAmount);
            } else if (this.data.paidAheadFlag) {
                label = "Next Required Payment";
                val = formatDateMMDDYYYY(this.data.dueDate);
            }
            jQuery("#acctdet-summaryDueAmtAndDate .amountDueLabel").html(label);
            jQuery("#acctdet-summaryDueAmtAndDate .amountDueValue").html(val);
            var scheduledMonthlyPayment = formatDollar(this.data.scheduledMonthlyPayment);
            jQuery("#acctdet-summaryDueAmtAndDate .scheduledMonthlyPayment").html(scheduledMonthlyPayment);
            summaryDueAmtAndDate.show();
        } else {
            summaryDueAmtAndDate.hide();
        }
        var lastPaymentAmount = formatDollar(this.data.lastPaymentAmount);
        jQuery("#acctdet .lastPaymentAmount").html(lastPaymentAmount);
        if (this.data.lastPaymentAmount > 0) {
            var lastPaymentDate = formatDateMMMDD(this.data.lastPaymentDate);
            jQuery("#acctdet-lastPaymentDate .ui-block-b").html(lastPaymentDate);
            jQuery("#acctdet-lastPaymentDate").show();
        } else {
            jQuery("#acctdet-lastPaymentDate").hide();
        }
        
        jQuery("#acctdet .ui-block-b .principalBalance").html(formatDollar(this.data.principalBalance));
        jQuery("#acctdet .ui-block-b .accruedInterest").html(formatDollar(this.data.accruedInterest));
        jQuery("#acctdet .ui-block-b .totalBalance").html(formatDollar(this.data.totalBalance));
        jQuery("#acctdet .ui-block-b .status").html(this.data.status === "View Details" ? "Multiple Status" : this.data.status);
        
    };
    
    ServicedAccount.prototype.buildMakePmtAcctrow = function () {
        var html = '<div id="makePmtAcctrow' + this.index + '">';
        html = html + '<div class="ui-block-a">' + this.data.loanType + '</div>';
        html = html + '<div class="ui-block-b"><span id="makePmtPayamt' + this.index + '">$xxx.xx</span></div>';
        html = html + '</div>';
        return jQuery(html);
    };
    
    ServicedAccount.prototype.initialize = function () {
        var self = this;
        
        var acctlist = jQuery("#acctlist ul");
        var listitem = self.buildAcctlistItem();
        listitem.appendTo(acctlist);
        
        var makePmtRows = jQuery("#makePmt #makePmtRows");
        this.buildMakePmtAcctrow().appendTo(makePmtRows);
        
        var payamt = jQuery("#acctlistPayamt" + self.index);
        var payamtString = "0.00";
        if (self.isPaymentRequestedWithAmount()) {
            payamtString = Number(self.requestedPaymentAmount).toFixed(2);
        } else {
            jQuery("#acctlistPayamtFieldset" + self.index).hide();
        }
        payamt.val(payamtString);
        jQuery("#makePmtPayamt" + this.index).text("$" + payamtString);
        
        this.togglePaymentDetailsRow();
        
        this.applyIndicators();
        
    };
    
    var addServicedAccount = function (data) {
        var acctIndex = servicedAccounts.length;
        data.index = acctIndex;
        var acct = new ServicedAccount(data);
        servicedAccounts[acctIndex] = acct;
        acct.initialize();
        return acct;
    };
    
    var validateRequestedPaymentAmounts = function () {
        var valid = true;
        jQuery.each(servicedAccounts, function (acctIndex, account) {
            if (account.paymentRequested) {
                var v = Number(jQuery("#acctlistPayamt" + acctIndex).val());
                valid = v > 0 && valid;
            }
        });
        return valid;
    };
    
    var isPayOffRequested = function () {
        var payoffRequested = false;
        jQuery.each(servicedAccounts, function (acctIndex, account) {
            if (account.paymentRequested && (account.requestedPaymentAmount === account.data.totalBalance)) {
                payoffRequested = true;
                return true;
            }
        });
        return payoffRequested;
    };
    
    var payNowClicked = function () {
        refreshPaymentDate(!isPayOffRequested());
        return validateRequestedPaymentAmounts() && Number(jQuery("#paytot").val()) > 0;
    };
    
    var addBankacctHide = function () {
        //reset form inputs
        jQuery("#addBankacctForm")[0].reset();
        jQuery("#addBankacctSavetoggle").slider("refresh");
        //style as successful validation
        //jQuery("#addBankacctForm :input").callSuccessAll();
        jQuery("#addBankacctErrors").html("");
    };
    
    var addBankacctSuccessHandler = function (data) {
        //Show bank account list if necessary (if this is the first added account) 
        if (jQuery('#bankacctSelectContainer').is(':hidden')) {
            jQuery('#noBankAccountMessage').hide();
            jQuery('#bankacctSelectContainer').show();
        }
        var bankacctSelect = jQuery("#bankacctSelect");
        var baSelect = bankacctSelect[0];
        var selIndex = baSelect.options.length;
        baSelect.options[selIndex] = new Option(data.name, selIndex);
        baSelect.selectedIndex = selIndex;
        // refresh the display
        bankacctSelect.selectmenu("refresh");
        jQuery(".ui-loader").hide();
        jQuery("#addBankacctBtn").button("enable");
        jQuery("#addBankacct").dialog("close");
        //jQuery.mobile.changePage("#makePmt", "pop", true, false);
    };
    
    var addBankacctFormSubmitted = function () {
        var form = jQuery(this);
        jQuery("#addBankacctErrors").html("");
        jQuery("#addBankacctBtn").button("disable");
        jQuery(".ui-loader").show();
        var bankAccount = {
            routingNumber: jQuery("#addBankacctRoutingNr", form).val(),
            accountNumber: jQuery("#addBankacctAccountNr", form).val(),
            name: jQuery("#addBankacctName", form).val(),
            saved: jQuery("#addBankacctSavetoggle", form).val()
        };
        setTimeout(function () { addBankacctSuccessHandler(bankAccount); }, 1500);
        return false;
    };
    
    var submitPaymentClicked = function () {
        var bankacctSelect = jQuery('#bankacctSelect');
        return bankacctSelect.children('option').size() > 0
    };
    
    var makePmtSuccessHandler = function (data) {
        var paymentDate = formatDateMMDDYYYY(data.paymentDate);
        jQuery.each(servicedAccounts, function (index, acct) {
            if (acct.isPaymentRequestedWithAmount()) {
                acct.data.scheduledPaymentsFlag = true;
                jQuery("#acctlist-item" + index + " .pmtscheduled").show();
                jQuery("#notify-area .pmtscheduled").show();
                jQuery("#acctdet-notify-area" + index + " .pmtscheduled").show();
                jQuery("#acctdet-schdpmts" + index).show();
                var pmt = {
                    payOnDate: data.paymentDate,
                    paymentAmount: acct.requestedPaymentAmount
                };
                if (acct.data.unprocessedPayments) {
                    acct.data.unprocessedPayments[acct.data.unprocessedPayments.length] = pmt;
                } else {
                    acct.data.unprocessedPayments = [pmt];
                }
            }
        });
        
        jQuery("#pmtSubmittedPaymentDate").text(paymentDate);
        
        var bankAccountName = jQuery("#bankacctSelect")[0].options[data.bankAccountIndex].text;
        jQuery("#pmtSubmittedBankacctName").text(bankAccountName);
        jQuery("#pmtSubmittedMsgConfNr").text(data.confirmationNumber);
        jQuery(".ui-loader").hide();
        jQuery("#makePmt-confirm-yes-btn").button("enable");
        jQuery.mobile.changePage(jQuery("#pmtSubmitted"), { transition: "pop", reverse: true });
    };
    
    var postPmtTransaction = function () {
        jQuery("#makePmt-confirm-yes-btn").button("disable");
        jQuery(".ui-loader").show();
        
        var payments = [];
        jQuery.each(servicedAccounts, function (index, acct) {
            if (acct.isPaymentRequestedWithAmount()) {
                var payment = {
                    servicedAccountGroupIdNumber: acct.data.scrambledServicedAccountGroupId,
                    requestedPaymentAmount: acct.requestedPaymentAmount
                };
                payments[payments.length] = payment;
            }
        });

        var form = jQuery("#makePmtForm");
        var paymentTransactionReq = {
            paymentDate: Number(jQuery("#paymentDateSelect", form).val()),
            bankAccountIndex: jQuery("#bankacctSelect", form).val(),
            payments: payments,
            confirmationNumber: "852147"
        };
        
        setTimeout(function () { makePmtSuccessHandler(paymentTransactionReq); }, 1500);
        return false;
    };
    
    var fetchDataSuccessHandler = function (data) {
        jQuery("#acctlist #welcome-msg #welcome-username").text(data.userName);
        jQuery('#acctlist #welcome-msg').slideDown();
        
        var summaries = data.summaries;
        jQuery.each(summaries, function (index, summary) {
            var acct = addServicedAccount(summary);
        });
        
        var bankAccounts = data.bankAccounts;
        if (bankAccounts && bankAccounts.length > 0) {
            jQuery("#noBankAccountMessage").hide();
            var bankacctSelect = jQuery("#bankacctSelect");
            var baSelect = bankacctSelect[0];
            jQuery.each(bankAccounts, function (index, bankAccount) {
                var selIndex = baSelect.options.length;
                baSelect.options[selIndex] = new Option(bankAccount.name, selIndex);
            });
            bankacctSelect.selectmenu();
            bankacctSelect.selectmenu("refresh");
            jQuery("#bankacctSelectContainer").show();
        } else {
            jQuery("#noBankAccountMessage").show();
            jQuery("#bankacctSelectContainer").hide();
        }
        
        var paymentDateSelect = jQuery("#makePmt #paymentDateSelect");
        var paymentDateSelectElement = paymentDateSelect[0];
        var availablePaymentDates = data.availablePaymentDates;
        jQuery.each(availablePaymentDates, function (index, payDate) {
            var option = new Option(formatDateEEEMMMDD(payDate), payDate);
            paymentDateSelectElement.options[paymentDateSelectElement.options.length] = option;
        });
        paymentDateSelect.selectmenu();
        paymentDateSelect.selectmenu("refresh");

        refreshPaymentTotal();
        // apply jqm sauce to the dynamic content
        jQuery("#acctlist ul").listview("refresh");
        jQuery("#acctlist").page("destroy").page();
        jQuery('.ui-loader').hide();
    };
    
    var fetchData = function () {
        var accountData = {"summaries":[{"scrambledServicedAccountGroupId":623568830000001,"loanType":"Stafford Loans","lenderName":"Bank of America","lenderNumber":"824421","endorserView":false,"secondaryCoBorrowerView":null,"borrowerName":null,"totalBalance":5463.56,"principalBalance":5000.00,"accruedInterest":463.56,"amountDue":123.45,"status":"In Repayment","dueDate":1310051017480,"lastPaymentAmount":130.00,"lastPaymentDate":1307372617480,"scheduledMonthlyPayment":123.45,"autoPaymentAmount":null,"amountPastDue":0.00,"unprocessedPayments":null,"paidAheadFlag":false,"displaySummaryDueAmtAndDate":true,"autoPayFlag":false,"autoPayPendingFlag":false,"pastDueFlag":false,"pendingPaymentsFlag":false,"scheduledPaymentsFlag":false,"autoPayPendingDate":null,"borrowerAccountIdNr":null,"paymentSuggested":true},{"scrambledServicedAccountGroupId":623568830000002,"loanType":"Graduate PLUS Loans","lenderName":"Wells Fargo","lenderNumber":"802176","endorserView":false,"secondaryCoBorrowerView":null,"borrowerName":null,"totalBalance":11345.00,"principalBalance":10210.50,"accruedInterest":1134.50,"amountDue":234.50,"status":"In Repayment","dueDate":1310051017480,"lastPaymentAmount":234.50,"lastPaymentDate":1307372617480,"scheduledMonthlyPayment":234.50,"autoPaymentAmount":null,"amountPastDue":0.00,"unprocessedPayments":null,"paidAheadFlag":false,"displaySummaryDueAmtAndDate":true,"autoPayFlag":false,"autoPayPendingFlag":false,"pastDueFlag":false,"pendingPaymentsFlag":false,"scheduledPaymentsFlag":false,"autoPayPendingDate":null,"borrowerAccountIdNr":null,"paymentSuggested":true}],"bankAccounts":[{"id":1234,"name":"Steve's Checking Account","saved":false},{"id":5678,"name":"Steve's Savings Account","saved":false}],"availablePaymentDates":[1309446217480,1309532617480,1309791817480,1309878217480,1309964617480,1310051017480,1310137417480,1310396617480,1310483017480,1310569417480,1310655817480,1310742217480,1311001417480,1311087817480,1311174217480,1311260617480,1311347017480,1311606217480,1311692617480,1311779017480,1311865417480,1311951817480],"userName":"STEVE","errorMessage":null};
        fetchDataSuccessHandler(accountData);
    };
    
    var homeHref = window.location.href;
    
    var logoutClicked = function () {
        jQuery(".ui-loader").show();
        setTimeout(function() { window.location.href = homeHref; }, 250);
        return false;
    };
    
    myjs.accounts = {
            
        initialize: function () {
            jQuery(".ui-loader").show();
            setTimeout(fetchData, 1500);
            
            /** Attach handlers. */
            jQuery("#makePmtLink").bind("click", payNowClicked);
            jQuery("#addBankacct").live("pagehide", addBankacctHide);
            jQuery("#addBankacctForm").submit(addBankacctFormSubmitted);
            jQuery("#submitPaymentBtn").bind("click", submitPaymentClicked); 
            jQuery("#makePmtForm").submit(function () { return false; });
            jQuery("#makePmt-confirm-yes-btn").click(postPmtTransaction);
            var logoutBtns = jQuery(".logout-btn");
            jQuery.each(logoutBtns, function (index, item) {
                jQuery(item).click(logoutClicked);
            });
            jQuery("#welcome-msg a").bind("click", function () { jQuery(this.parentNode).slideUp(); return false; });
            var addBankacctFormInputs = jQuery("#addBankacctForm :input");
            jQuery.each(addBankacctFormInputs, function (index, value) {
                jQuery(value).blur(trimOnBlurHandler);
            });
        }

    };

}(jQuery, myjs));
