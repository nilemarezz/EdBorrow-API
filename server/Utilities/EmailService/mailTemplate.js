const config = require("../../config.json");

const temp = (value, url) => {
  return ` 
    <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width" name="viewport" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <title></title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }
  
      table,
      td,
      tr {
        vertical-align: top;
        border-collapse: collapse;
      }
  
      * {
        line-height: inherit;
      }
  
      a[x-apple-data-detectors="true"] {
        color: inherit !important;
        text-decoration: none !important;
      }
    </style>
    <style id="media-query" type="text/css">
      @media (max-width: 660px) {
        .block-grid,
        .col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
  
        .block-grid {
          width: 100% !important;
        }
  
        .col {
          width: 100% !important;
        }
  
        .col > div {
          margin: 0 auto;
        }
  
        img.fullwidth,
        img.fullwidthOnMobile {
          max-width: 100% !important;
        }
  
        .no-stack .col {
          min-width: 0 !important;
          display: table-cell !important;
        }
  
        .no-stack.two-up .col {
          width: 50% !important;
        }
  
        .no-stack .col.num4 {
          width: 33% !important;
        }
  
        .no-stack .col.num8 {
          width: 66% !important;
        }
  
        .no-stack .col.num4 {
          width: 33% !important;
        }
  
        .no-stack .col.num3 {
          width: 25% !important;
        }
  
        .no-stack .col.num6 {
          width: 50% !important;
        }
  
        .no-stack .col.num9 {
          width: 75% !important;
        }
  
        .video-block {
          max-width: none !important;
        }
  
        .mobile_hide {
          min-height: 0px;
          max-height: 0px;
          max-width: 0px;
          display: none;
          overflow: hidden;
          font-size: 0px;
        }
  
        .desktop_hide {
          display: block !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  
  <body
    class="clean-body"
    style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f3f2f3;"
  >
    <table
      bgcolor="#f3f2f3"
      cellpadding="0"
      cellspacing="0"
      class="nl-container"
      role="presentation"
      style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f2f3; width: 100%;"
      valign="top"
      width="100%"
    >
      <tbody>
        <tr style="vertical-align: top;" valign="top">
          <td style="word-break: break-word; vertical-align: top;" valign="top">
            <div style="background-color:transparent;">
              <div
                class="block-grid"
                style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;"
              >
                <div
                  style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;background-image:url('https://equipment-image.s3-ap-southeast-1.amazonaws.com/Mail/bg-shade.jpg');background-position:center top;background-repeat:repeat"
                >
                  <div
                    class="col num12"
                    style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;"
                  >
                    <div style="width:100% !important;">
                      <div style="margin-top: 50px;">
                        <div>
                          <center>
                            <p
                              style="text-align: center; font-family:Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: bold; font-size: large; color: #004afd;"
                            >
                              Confirmation Borrowing Form: Request ${value.data[0].requestId}
                            </p>
                            <br />
                            <table
                              style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;
          text-align: left;width:100%"
                            >
                              <tr>
                                <th width="20%" style="text-align:right;">
                                  User Id:
                                </th>
                                <td width="80%">${value.data[0].userId}</td>
                              </tr>
                              <tr>
                                <th width="20%" style="text-align:right;">
                                  Name:
                                </th>
                                <td width="80%">${value.data[0].Name}</td>
                              </tr>
  
                              <tr>
                                <th width="20%" style="text-align:right;">
                                  Email:
                                </th>
                                <td width="80%">${value.data[0].email}</td>
                              </tr>
                              <tr>
                                <th width="20%" style="text-align:right;">
                                  Tel:
                                </th>
                                <td width="80%">${value.data[0].userTelNo}</td>
                              </tr>
                              <tr>
                                <th width="20%" style="text-align:right;">
                                  Purpose:
                                </th>
                                <td width="80%">
                                  ${value.data[0].borrowPurpose}
                                </td>
                              </tr>
                              <tr>
                                <th width="20%" style="text-align:right;">
                                  Duration: 
                                </th>
                                <td width="80%">
                                ${value.data[0].borrowDate
      .toString()
      .substring(
        4,
        16
      )} to ${value.data[0].borrowDate
        .toString()
        .substring(4, 16)}
                                </td>
                              </tr>
                              <tr>
                                <th width="20%" style="text-align:right;">
                                  Item:
                                </th>
                                <td width="80%">
                                  ${value.data.map(item => {
          return `${item.itemName}`;
        })}
                                </td>
                              </tr>
                            </table>
                          </center>
                        </div>
                                    
                        <div style="margin-top: 20px;">
                          <center>
                         <a href="${url}&status=TRUE">                         
                         <input
                                type="submit"
                                value="Approve"
                                style="background-color: #004afd;
              border: none;
              border-radius: 1px;
              font-family:'Roboto', sans-serif;
              color: white;
              padding: 9px 9px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: small;
              width: 100px;"
              >
              </a>
                            
                            <a href="${url}&status=FALSE">
                              <input
                                type="submit"
                                value="Reject"
                                style="background-color: #E10050;
              border: none;
              border-radius: 1px;
              font-family:'Roboto', sans-serif;
              color: white;
              padding: 9px 9px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: small;
              width: 100px;"
              
                              />
                              </a>
                            
                          </center>
                        </div>
                      </div>
  
                      <div
                        style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"
                      >
                        <div
                          align="center"
                          class="img-container center autowidth"
                          style="padding-right: 0px;padding-left: 0px;"
                        >
                          <img
                            align="center"
                            alt="Image"
                            border="0"
                            class="center autowidth"
                            src="https://equipment-image.s3-ap-southeast-1.amazonaws.com/Mail/reminder-hero-graph.png"
                            style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 640px; display: block;"
                            title="Image"
                            width="640"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  
  `;
};

module.exports = temp;
