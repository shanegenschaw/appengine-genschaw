<div data-role="page" id="acctlist" data-theme="b" class="acctlistPage">
<div data-role="header">
<h1>Summary</h1>
<a href="/borrower/m/authentication/out" data-ajax="false" data-role="button" class="ui-btn-right logout-btn">Log Out</a>
</div>
<div data-role="content">
<div id="welcome-msg" class="welcome-msg" style="display:none;">
<a href="#" data-role="button" data-icon="delete" data-iconpos="right" data-theme="e">WELCOME, <span id="welcome-username">username</span></a>
</div>
<div class="acctlistTop ui-corner-all">
<div class="ui-grid-a">
<div class="ui-block-a"><strong><span id="acctlistPaytot">$0.00</span></strong><br />
<span id="acctlistNrOfAccts">0</span> <span id="acctlistNrOfAcctsLabel">Accounts</span>
</div>
<div class="ui-block-b paynow-btn"><span class="pay-btn"><a id="makePmtLink" href="#makePmt" data-role="button" data-inline="true" data-theme="b">PAY NOW</a></span></div>
</div>
<div id="notify-area" class="notify-area-top">
<div class="pastdue" style="display:none;">Your payment is past due.</div>
<div class="autopay" style="display:none;">You're currently enrolled in Auto Pay.</div>
<div class="paidahead" style="display:none;">You're currently paid ahead.</div>
<div class="pmtscheduled" style="display:none;">You've scheduled a payment.</div>
<div class="pmtprocessing" style="display:none;">A payment is currently processing.</div>
</div>
</div>
<ul data-role="listview" data-inset="true">
</ul>
</div>
<div data-role="footer">&copy; My Company 2011</div>
</div>

<div data-role="page" id="acctdet" data-theme="b" class="acctdetPage" data-add-back-btn="true">
<div data-role="header"><h1>Account Details</h1></div>
<div data-role="content">
<div class="acctsummary acctlistTop-b ui-corner-all">
<div class="acctlistTop-padding">
<h3>summary.loanType</h3>
<h2>summary.borrowerName</h2>
<div class="lender">summary.lenderName (summary.lenderNumber)</div>
<div id="acctdet-notify-area" class="notify-area-detail">
<div class="pastdue" style="display:none;">Your payment is past due.</div>
<div class="autopay" style="display:none;">You're currently enrolled in Auto Pay.</div>
<div class="autopayLabel" style="display:none;"><strong>Note:</strong> The posting of your <span class="autopayDate">MMDDYYYY</span> Auto Pay payment is pending.  Please allow 1 to 2 business days for the payment to be reflected in your account details.</div>
<div class="paidahead" style="display:none;">You're currently paid ahead.</div>
<div class="pmtscheduled" style="display:none;">You've scheduled a payment.</div>
<div class="pmtprocessing" style="display:none;">A payment is currently processing.</div>
</div>
</div>
</div>

<div id="acctdet-schdpmts" class="scheduled-payments" style="display:none;">
<div class="grid-title">Scheduled Payments</div>
<div class="ui-grid-a grid-data"></div>
</div>

<div class="ui-grid-a grid-data details-group">
<div class="details-grouping">
<div id="acctdet-summaryDueAmtAndDate">
    <div class="ui-block-a amountDueLabel">amountLabel</div>
    <div class="ui-block-b amountDueValue">$xxx.xx</div>
<div class="ui-block-a">Scheduled Monthly Payment</div>
    <div class="ui-block-b scheduledMonthlyPayment">$xxx.xx</div>
</div>

<div class="ui-block-a">Last Payment Amount</div>
<div class="ui-block-b lastPaymentAmount">$xxx.xx</div>
<div id="acctdet-lastPaymentDate">
    <div class="ui-block-a">Last Payment Date</div>
    <div class="ui-block-b">MMM dd</div>
</div>
<div class="clear"></div>
</div>

<div class="details-grouping">
<div class="ui-block-a">Principal</div>
<div class="ui-block-b"><span class="principalBalance">$xxx.xx</span></div>
<div class="ui-block-a">Accrued Interest</div>
<div class="ui-block-b"><span class="accruedInterest">$xxx.xx</span></div>
<div class="ui-block-a">Total</div>
<div class="ui-block-b"><span class="totalBalance">$xxx.xx</span></div>
<div class="ui-block-a">Status</div>
<div class="ui-block-b"><span class="status">status</span></div>
<div class="clear"></div>
</div>
</div>

</div>
<div data-role="footer">&copy; My Company 2011</div>
</div>

<div data-role="page" id="makePmt" data-theme="b" class="makePmtPage" data-add-back-btn="true">
<div data-role="header"><h1>Payment Details</h1></div>
<div data-role="content">
<form id="makePmtForm" action="/borrower/m/paymentTransaction" method="post">
<div class="pay-summary ui-corner-all acctlistTop-b">
<div class="ui-grid-a">
<div class="ui-block-a dataTableHeader">Account</div>
<div class="ui-block-b dataTableHeader">Payment</div>
<div id="makePmtRows"></div>
<div style="clear: both;"></div><br />
<div class="ui-block-a"><strong>Payment Total:</strong></div>
<div class="ui-block-b"><strong><span id="makePmtPaytot">$xxx.xx</span></strong></div>
<input type="hidden" id="paytot" name="paytot" value="0.00"
    data-glvalidate-type="more"
    data-glvalidate-more-param="5"
    data-glvalidate-more-message="Total Minimum Payment must be at least $5.00."
 />
</div>
</div>

<div data-role="fieldcontain">
<label for="bankacctSelect" class="select">Pay From</label>
<div id="noBankAccountMessage">
    Please add a bank account to make a payment.
</div>
<div id="bankacctSelectContainer">
<span class="generic-btn-b">
<select name="bankacctSelect" id="bankacctSelect" data-theme="b"
    data-glvalidate-type="listnotempty"
    data-glvalidate-listnotempty-message="Please add a new bank account to use for your payment."></select>
</span>
</div>
<span class="generic-btn-b">
<a href="#addBankacct" data-role="button" data-icon="plus" data-inline="true" data-rel="dialog" data-transition="pop">Add Bank Account</a>
</span>
</div>

<div data-role="fieldcontain">
<label for="paymentDateSelect" class="select">Pay On</label>
<span class="generic-btn-b">
<select name="paymentDateSelect" id="paymentDateSelect" data-theme="b"></select>
</span>
</div>

<p>
<span class="pay-btn">
<a href="#makePmtConfirm" id="submitPaymentBtn" data-rel="dialog" data-transition="pop" data-role="button">Submit Payment</a>
</span>
</p>

</form>
</div>
<div data-role="footer">&copy; My Company 2011</div>
</div>

<div data-role="page" id="makePmtConfirm" data-theme="b">
<div data-role="header"><h1>Confirm</h1></div>
<div data-role="content">
<p>If you proceed, funds will be withdrawn from the checking or savings account you designated. Are you sure you want to submit this payment?</p>
<div data-role="controlgroup" data-type="horizontal">
<input type="button" id="makePmt-confirm-yes-btn" value="OK" />
<a href="#makePmt" data-role="button" data-rel="back" data-icon="back">Cancel</a>
</div>
</div>
</div>

<div data-role="page" id="addBankacct" data-theme="b" class="addBankacctPage">
<div data-role="header"><h1>Add Bank Account</h1></div>
<div data-role="content" >
<div id="addBankacctErrors" style="color:red;"></div>
<form id="addBankacctForm" action="/borrower/m/bankAccount" method="post">
<ul data-role="listview">
<li data-role="fieldcontain">
    <div class="field-error" id="addBankacctRoutingNrError"></div>
    <label for="addBankacctRoutingNr">Routing Number</label>
    <input type="number" name="addBankacctRoutingNr" id="addBankacctRoutingNr" value=""
       data-glvalidate-type="required pattern modulus10"
       data-glvalidate-pattern-param="^\d{9}$"
       data-glvalidate-required-message="You must enter a value for: Routing Number."
       data-glvalidate-pattern-message="Please enter a 9-digit number that represents a valid financial institution."
       data-glvalidate-modulus10-message="Please enter a 9-digit number that represents a valid financial institution."
     />
</li>
<li data-role="fieldcontain">
    <div class="field-error" id="addBankacctAccountNrError"></div>
    <label for="addBankacctAccountNr">Account Number</label>
    <input type="number" name="addBankacctAccountNr" id="addBankacctAccountNr" value=""
       data-glvalidate-type="required pattern"
       data-glvalidate-pattern-param="^\d*$"
       data-glvalidate-required-message="You must enter a value for: Account Number."
       data-glvalidate-pattern-message="The account number you entered isn't valid."
    />
</li>
<li data-role="fieldcontain">
    <div class="field-error" id="addBankacctNameError"></div>
    <label for="addBankacctName">Account Nickname</label>
    <input type="text" name="addBankacctName" id="addBankacctName" value="" 
        data-glvalidate-type="required notpattern notcontainval-rt notcontainval-bnk"
        data-glvalidate-notcontainval-rt-param="#addBankacctRoutingNr"
        data-glvalidate-notcontainval-bnk-param="#addBankacctAccountNr"
        data-glvalidate-notpattern-param='\(|\)|<|>|\,|;|:|\\|"|\[|\]'
        data-glvalidate-required-message="You must enter a value for: Account Nickname."
        data-glvalidate-notcontainval-rt-message="The account nickname you entered isn't valid. It cannot contain your bank account number, routing number, SSN, or profanity."
        data-glvalidate-notcontainval-bnk-message="The account nickname you entered isn't valid. It cannot contain your bank account number, routing number, SSN, or profanity."
        data-glvalidate-notpattern-message="The account nickname you entered isn't valid. It cannot contain special characters other than a period or apostrophe."
    />
</li>
<li data-role="fieldcontain">
    <label for="addBankacctSavetoggle">Save this account</label>
    <select name="addBankacctSavetoggle" id="addBankacctSavetoggle" data-role="slider" class="savetoggle">
<option value="false">No</option>
<option value="true">Yes</option>
</select>
</li>
<li data-role="fieldcontain">
<div data-role="controlgroup" data-type="horizontal">
<button type="submit" id="addBankacctBtn" data-icon="plus">Ok</button>
<a href="#makePmt" data-role="button" data-icon="back" data-rel="back">Cancel</a>
</div>
</li>
</ul>
</form>
</div>
</div>

<div data-role="page" id="pmtSubmitted" data-theme="b" class="pmtSubmittedPage">
<div data-role="header" data-backbtn="false"><h1>Submitted</h1></div>
<div data-role="content">
<div class="success-msg">Success!</div>
<div class="pay-summary ui-corner-all acctlistTop-b">
<div class="ui-grid-a">
<div class="ui-block-a">Total Payment</div>
<div class="ui-block-b"><span id="pmtSubmittedPaytot">$xxx.xx</span></div>
<div class="ui-block-a">Paid From</div>
<div class="ui-block-b"><span id="pmtSubmittedBankacctName">xxxx</span></div>
<div class="ui-block-a">To Be Paid On</div>
<div class="ui-block-b"><span id="pmtSubmittedPaymentDate">mm/dd/yyyy</span></div>
</div>
</div>
<p>
<span id="pmtSubmittedMsg">
Thanks for submitting a payment.
Your payment confirmation number is <span id="pmtSubmittedMsgConfNr">00000</span>.
</span>
</p>
<p>
<span class="generic-btn-b">
<a href="/borrower/m/authentication/out" data-ajax="false" data-role="button" class="logout-btn">Log Out</a>
<a href="#acctlist" data-role="button" data-direction="reverse">Account Summary</a>
</span>
</p>
</div>
<div data-role="footer">&copy; My Company 2011</div>
</div>

<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript">
(function (jQuery, myjs) {
    jQuery(window).bind("load", function() {
        myjs.accounts.initialize();
    });
}(jQuery, myjs));

</script>
