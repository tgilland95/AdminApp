<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
  <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
  <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
  <meta name="WebPartPageExpansion" content="full" />

  <!-- Add your CSS styles to the following file -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css" />
  <link rel="stylesheet" type="text/css" href="../Content/App.css" />

  <!-- Add your JavaScript to the following file -->
  <script type="text/javascript" src="https://rawgit.com/tgilland95/spDevCdn/master/main.bundle.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
  Administrator Hub
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
  <br />
  <br />
  <br />
  <div class="container-fluid">
    <ul class="nav nav-tabs" id="nav-tabs">
      <li class="active"><a data-toggle="tab" href="#approve-tab">Pending Approvals</a></li>
      <li><a data-toggle="tab" href="#report-tab">Reports</a></li>
      <li><a data-toggle="tab" href="#add-record-tab">Add Record</a></li>
    </ul>
    <div class="tab-content">
      <div id="approve-tab" class="tab-pane fade in active">
      </div>
      <div id="report-tab" class="tab-pane fade">
      </div>
      <div id="add-record-tab" class="tab-pane fade">
      </div>
    </div>
  </div>
</asp:Content>
