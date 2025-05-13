/**
 * @author [Sujal]
 * @email [sujalagrawalgondia@gmail.com]
 * @desc [Routing for excel upload for leads]
 */

const express = require("express");
const leadsController = require("../controllers/leadsController");
const router = express.Router();
const multer = require("multer");
const app = express();

//const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype == "application/x-vnd.oasis.opendocument.spreadsheet" ||
    file.mimetype == "text/csv"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const upload = multer({
//     fileFilter,
//     storage
// });

// app.use(upload.array());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.file_name);
  },
});

const uploadStorage = multer({ storage: storage });

/**
 * @swagger
 * /api/v1/uploadLeadsData:
 *   post:
 *     summary: Save lead details from an uploaded file
 *     description: This API endpoint allows you to upload a file containing lead details, process the data, and save it to the database. It checks for duplicates based on phone numbers and creates corresponding lead contacts.
 *     parameters:
 *       - name: file_name
 *         in: body
 *         description: The name of the file containing the lead data to be uploaded.
 *         required: true
 *         schema:
 *           type: string
 *           example: "leads.xlsx"
 *       - name: source
 *         in: body
 *         description: The source from which the leads are generated.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Website"
 *       - name: lead_desc
 *         in: body
 *         description: The description of the leads.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Leads from the website contact form."
 *       - name: org_id
 *         in: body
 *         description: The ID of the organization to associate the leads with.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully saved the lead details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *       400:
 *         description: Bad request, missing file or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Please upload a file."
 *       500:
 *         description: Server error, unable to process the file or save the lead data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post(
  "/api/v1/uploadLeadsData",
  uploadStorage.single("excel-file"),
  leadsController.saveLeadsDetails
);

/**
 * @swagger
 * /api/v1/getLeadDetails:
 *   post:
 *     summary: Get lead details by organization ID
 *     description: This API retrieves all lead details associated with the given organization ID and returns their information.
 *     parameters:
 *       - name: org_id
 *         in: body
 *         description: The ID of the organization whose lead details are to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved lead details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       source:
 *                         type: string
 *                         example: "Marketing Campaign"
 *                       id:
 *                         type: integer
 *                         example: 456
 *                       total_records:
 *                         type: integer
 *                         example: 100
 *                       duplicates:
 *                         type: integer
 *                         example: 5
 *                       response:
 *                         type: integer
 *                         example: 95
 *                       file_name:
 *                         type: string
 *                         example: "lead_data.csv"
 *                       status:
 *                         type: string
 *                         example: "Active"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-20T10:00:00Z"
 *                       orgId:
 *                         type: integer
 *                         example: 123
 *       400:
 *         description: Bad request, invalid organization ID or data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Invalid organization ID"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/api/v1/getLeadDetails").post(leadsController.getLeadDetails);

/**
 * @swagger
 * /api/v1/getBroadcastedLeads:
 *   post:
 *     summary: Get broadcasted leads by organization ID
 *     description: This API retrieves all leads broadcasted via WhatsApp campaigns for the given organization ID.
 *     parameters:
 *       - name: org_id
 *         in: body
 *         description: The ID of the organization whose broadcasted leads are to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved broadcasted leads.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       whatsappBroadcastContnentID:
 *                         type: integer
 *                         example: 789
 *                       wp_template:
 *                         type: string
 *                         example: "WhatsApp Template 1"
 *                       status:
 *                         type: string
 *                         example: "Completed"
 *                       selected_leads:
 *                         type: integer
 *                         example: 200
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-20T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-21T15:00:00Z"
 *                       wa_campaign:
 *                         type: integer
 *                         example: 456
 *                       orgId:
 *                         type: integer
 *                         example: 123
 *                       campName:
 *                         type: string
 *                         example: "Campaign A"
 *                       totalSent:
 *                         type: integer
 *                         example: 180
 *                       allBroadcasted:
 *                         type: integer
 *                         example: 200
 *       400:
 *         description: Bad request, invalid organization ID or data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Invalid organization ID"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router
  .route("/api/v1/getBroadcastedLeads")
  .post(leadsController.getBroadcastedLeads);

/**
 * @swagger
 * /api/v1/getLeadContacts:
 *   post:
 *     summary: Get lead contacts by lead ID
 *     description: This API retrieves all lead contacts associated with the given lead ID and returns their details.
 *     parameters:
 *       - name: lead_id
 *         in: body
 *         description: The ID of the lead whose contacts are to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12345
 *     responses:
 *       200:
 *         description: Successfully retrieved lead contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       first_name:
 *                         type: string
 *                         example: "John"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       status:
 *                         type: string
 *                         example: "active"
 *                       is_duplicate:
 *                         type: boolean
 *                         example: false
 *       400:
 *         description: Bad request, invalid lead ID or data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Invalid lead ID"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/api/v1/getLeadContacts").post(leadsController.getLeadContacts);

/**
 * @swagger
 * /api/v1/getLeadLogs:
 *   post:
 *     summary: Get lead logs by broadcast ID
 *     description: This API retrieves all lead logs associated with the given broadcast ID and returns their details.
 *     parameters:
 *       - name: broadcast_id
 *         in: body
 *         description: The ID of the broadcast whose lead logs are to be retrieved.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 98765
 *     responses:
 *       200:
 *         description: Successfully retrieved lead logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       postID:
 *                         type: string
 *                         example: "123456789"
 *                       status:
 *                         type: string
 *                         example: "SUCCESS"
 *                       sent:
 *                         type: integer
 *                         example: 1
 *                       delivered:
 *                         type: integer
 *                         example: 1
 *                       read:
 *                         type: integer
 *                         example: 0
 *                       received:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-20T10:00:00Z"
 *       400:
 *         description: Bad request, invalid broadcast ID or data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Invalid broadcast ID"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/api/v1/getLeadLogs").post(leadsController.getLeadLogs);

/**
 * @swagger
 * /api/v1/getTemplates:
 *   post:
 *     summary: Retrieve WhatsApp message templates for a given organization
 *     description: This endpoint retrieves the available WhatsApp message templates for the organization by accessing the WhatsApp Business Account using the organization's connection details.
 *     parameters:
 *       - name: org_id
 *         in: body
 *         description: The ID of the organization for which templates are to be fetched.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully fetched the templates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "template_id_1"
 *                       name:
 *                         type: string
 *                         example: "Welcome Template"
 *       400:
 *         description: Bad request, missing organization ID or failed to connect to WhatsApp.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Connect whatsapp first..."
 *       500:
 *         description: Server error, unable to fetch templates from WhatsApp API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/api/v1/getTemplates").post(leadsController.getTemplates);

/**
 * @swagger
 * /api/v1/getWhatsAppAnalytics:
 *   post:
 *     summary: Fetches WhatsApp analytics for a given organization.
 *     description: This endpoint retrieves WhatsApp campaign analytics, including the total number of leads and sent messages for a specified organization, along with unique campaigns.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Request body containing the organization ID, start date, end date, and duration for the analytics.
 *         schema:
 *           type: object
 *           properties:
 *             orgId:
 *               type: integer
 *               description: The organization ID associated with the WhatsApp connection.
 *               example: 123
 *             startDate:
 *               type: string
 *               format: date
 *               description: The start date for the analytics period.
 *               example: '2024-01-01'
 *             endDate:
 *               type: string
 *               format: date
 *               description: The end date for the analytics period.
 *               example: '2024-12-31'
 *             duration:
 *               type: string
 *               description: The duration for the analytics (optional).
 *               example: 'monthly'
 *     responses:
 *       200:
 *         description: Successfully fetched WhatsApp analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Whatsapp Leads Fetched Successfully
 *                 totalLeads:
 *                   type: integer
 *                   example: 10
 *                 totalWhatsappSent:
 *                   type: integer
 *                   example: 8
 *                 getUniqueCampaigns:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       waBroadcastLogID:
 *                         type: integer
 *                         example: 1
 *                       leadId:
 *                         type: integer
 *                         example: 101
 *                       fromNumber:
 *                         type: string
 *                         example: '+1234567890'
 *                       postID:
 *                         type: string
 *                         example: 'xyz123'
 *                       status:
 *                         type: string
 *                         example: 'sent'
 *                       wp_template_name:
 *                         type: string
 *                         example: 'Welcome Template'
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-12-20T12:34:56Z'
 *                       wa_campaign:
 *                         type: string
 *                         example: 'Campaign 1'
 *                       wa_campaign_name:
 *                         type: string
 *                         example: 'Christmas Sale Campaign'
 *       500:
 *         description: Internal server error, unable to fetch WhatsApp analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to fetch WhatsApp analytics
 */
router
  .route("/api/v1/getWhatsAppAnalytics")
  .post(leadsController.getWhatsAppAnalytics);

/**
 * @swagger
 * /api/v1/getSocialInbox:
 *   post:
 *     summary: Retrieves messages from the social media inbox based on various filters.
 *     description: This endpoint fetches unread messages from a social media inbox based on specified filters like message type, channel name, and organization ID.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Request body containing the filters and pagination details.
 *         schema:
 *           type: object
 *           properties:
 *             orgId:
 *               type: integer
 *               description: The organization ID requesting the inbox data.
 *               example: 123
 *             startDate:
 *               type: string
 *               format: date
 *               description: The start date for filtering the inbox messages.
 *               example: '2024-01-01'
 *             endDate:
 *               type: string
 *               format: date
 *               description: The end date for filtering the inbox messages.
 *               example: '2024-12-31'
 *             duration:
 *               type: string
 *               description: Optional parameter to filter messages by duration.
 *               example: 'weekly'
 *             type:
 *               type: string
 *               description: The type of message (e.g., "INCOMING" or "OUTGOING").
 *               example: 'INCOMING'
 *             filterBy:
 *               type: string
 *               description: Filter to select the channel (e.g., "all", "WhatsApp").
 *               example: 'WhatsApp'
 *             page:
 *               type: integer
 *               description: The page number for pagination.
 *               example: 1
 *       - in: query
 *         name: pageSize
 *         required: false
 *         description: The number of records per page for pagination.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved social inbox messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 draw:
 *                   type: integer
 *                   example: 1
 *                 recordsTotal:
 *                   type: integer
 *                   example: 50
 *                 recordsFiltered:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       orgId:
 *                         type: integer
 *                         example: 123
 *                       messageType:
 *                         type: string
 *                         example: 'INCOMING'
 *                       channelName:
 *                         type: string
 *                         example: 'WhatsApp'
 *                       message:
 *                         type: string
 *                         example: 'Hello, how can I help you?'
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-12-20T14:00:00Z'
 *       500:
 *         description: Internal server error, unable to retrieve inbox messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to fetch social inbox messages.
 */
router.route("/api/v1/getSocialInbox").post(leadsController.getSocialInbox);

/**
 * @swagger
 * /api/v1/getWhatsAppAnalyticsDetails:
 *   post:
 *     summary: Retrieves WhatsApp analytics details based on the lead ID or organization ID.
 *     description: This endpoint fetches detailed WhatsApp analytics, including the number of leads, messages sent, delivered, read, and replied, based on either the lead ID (campaign) or organization ID.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Request body containing the leadId and orgId for filtering WhatsApp analytics.
 *         schema:
 *           type: object
 *           properties:
 *             leadId:
 *               type: string
 *               description: The lead ID or campaign ID to filter the analytics.
 *               example: '12345'
 *             orgId:
 *               type: integer
 *               description: The organization ID to filter the analytics.
 *               example: 1
 *     responses:
 *       200:
 *         description: Successfully fetched WhatsApp analytics details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 allLeads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       wa_campaign:
 *                         type: string
 *                         example: '12345'
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-12-20T14:00:00Z'
 *                 totalSent:
 *                   type: integer
 *                   example: 150
 *                 totalReceived:
 *                   type: integer
 *                   example: 120
 *                 totalRead:
 *                   type: integer
 *                   example: 100
 *                 totalReplied:
 *                   type: integer
 *                   example: 80
 *                 totalFailed:
 *                   type: integer
 *                   example: 20
 *                 message:
 *                   type: string
 *                   example: 'Whatsapp Lead Details Fetched'
 *       500:
 *         description: Internal server error while fetching the WhatsApp lead details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Whatsapp Leads Not Fetched'
 */
router
  .route("/api/v1/getWhatsAppAnalyticsDetails")
  .post(leadsController.getWhatsAppAnalyticsDetails);

/**
 * @swagger
 * /api/v1/checkToken:
 *   post:
 *     summary: Checks if the WhatsApp token exists for the given organization.
 *     description: This endpoint checks if a valid WhatsApp token is connected for the specified organization. If a token exists, a success response is returned. If not, an error message is triggered.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               org_id:
 *                 type: integer
 *                 description: The organization ID for which the WhatsApp token is being checked.
 *                 example: 123
 *     responses:
 *       200:
 *         description: WhatsApp token exists for the given organization.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *       400:
 *         description: WhatsApp is not connected for the given organization.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Connect WhatsApp first..."
 */
router.route("/api/v1/checkToken").post(leadsController.checkIfTokenExists);

/**
 * @swagger
 * /api/v1/addNewWaTemplate:
 *   post:
 *     summary: Add a new WhatsApp template
 *     description: This endpoint allows the creation of a new WhatsApp message template by providing details such as description, URL, CTA (call to action), and template name.
 *     parameters:
 *       - name: description
 *         in: body
 *         description: The description of the WhatsApp template.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Welcome message template"
 *       - name: url
 *         in: body
 *         description: The URL for media (e.g., an image) to be included in the template.
 *         required: true
 *         schema:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *       - name: cta
 *         in: body
 *         description: The call-to-action (CTA) text for the template.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Click here to get started"
 *       - name: templateName
 *         in: body
 *         description: The name for the new WhatsApp template.
 *         required: true
 *         schema:
 *           type: string
 *           example: "NewTemplate"
 *       - name: agency_id
 *         in: body
 *         description: The agency ID associated with the request.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *       - name: org_id
 *         in: body
 *         description: The organization ID for the request.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully created the WhatsApp template.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     templateId:
 *                       type: string
 *                       example: "template_id_1"
 *                     templateName:
 *                       type: string
 *                       example: "NewTemplate"
 *       400:
 *         description: Bad request, missing required parameters or failed to connect to WhatsApp.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Connect whatsapp first..."
 *       500:
 *         description: Server error, failed to create the WhatsApp template.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/api/v1/addNewWaTemplate").post(leadsController.addNewWaTemplate);

/**
 * @swagger
 * /api/v1/broadcastWhatsappMessages:
 *   post:
 *     summary: Broadcast WhatsApp messages to selected leads using a specified template
 *     description: This endpoint broadcasts WhatsApp messages to selected leads using a specified template and language. The user can define when the messages should be sent and track the broadcasting campaign.
 *     parameters:
 *       - name: curation_channel
 *         in: body
 *         description: The channel through which the content is curated.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Sales Campaign"
 *       - name: selected_leads
 *         in: body
 *         description: List of lead IDs to send the broadcast to.
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 3, 4]
 *       - name: wa_template
 *         in: body
 *         description: The WhatsApp template to be used for the broadcast.
 *         required: true
 *         schema:
 *           type: string
 *           example: "template_id_123"
 *       - name: postAt
 *         in: body
 *         description: The time(s) at which the messages should be posted.
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["2024-12-20T10:00:00Z", "2024-12-20T14:00:00Z"]
 *       - name: agency_id
 *         in: body
 *         description: The ID of the agency associated with the campaign.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *       - name: org_id
 *         in: body
 *         description: The organization ID to which the WhatsApp account belongs.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *       - name: wa_template_lang
 *         in: body
 *         description: The language in which the WhatsApp template will be sent.
 *         required: true
 *         schema:
 *           type: string
 *           example: "en"
 *       - name: file_url
 *         in: body
 *         description: URL of the media file to be included in the broadcast.
 *         required: true
 *         schema:
 *           type: string
 *           example: "https://example.com/media.jpg"
 *       - name: wa_campaign
 *         in: body
 *         description: The campaign ID associated with the WhatsApp broadcast.
 *         required: true
 *         schema:
 *           type: string
 *           example: "campaign_2024"
 *     responses:
 *       200:
 *         description: Successfully broadcasted the WhatsApp messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       messageId:
 *                         type: string
 *                         example: "msg_123456"
 *                       status:
 *                         type: string
 *                         example: "sent"
 *       400:
 *         description: Bad request, missing required parameters or failed to connect to WhatsApp.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Connect whatsapp first..."
 *       500:
 *         description: Server error, failed to broadcast the WhatsApp messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router
  .route("/api/v1/broadcastWhatsappMessages")
  .post(leadsController.broadcastWhatsappMessages);

/**
 * @swagger
 * /api/v1/deleteLead:
 *   post:
 *     summary: Deletes a lead based on the provided lead ID.
 *     description: This endpoint deletes the lead associated with the given `lead_id`. A success message is returned if the lead is deleted successfully. Otherwise, an error is thrown.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead_id:
 *                 type: integer
 *                 description: The ID of the lead to be deleted.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Lead successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Lead Deleted Successfully"
 *       400:
 *         description: Error occurred while deleting the lead.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Error message here"
 */
router.route("/api/v1/deleteLead").post(leadsController.deleteLead);

/**
 * @swagger
 * /api/v1/deleteUser:
 *   post:
 *     summary: Marks a user as deleted by updating their email.
 *     description: This endpoint updates the email of the user by appending "_deleted" and the current date to their email. The user is not permanently removed from the database, but flagged as deleted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user to be deleted.
 *                 example: 123
 *     responses:
 *       200:
 *         description: User successfully marked as deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User Deleted Successfully"
 *       400:
 *         description: Error occurred while deleting the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Error message here"
 */
router.route("/api/v1/deleteUser").post(leadsController.deleteUser);

/**
 * @swagger
 * /api/v1/webhook:
 *   post:
 *     summary: Webhook endpoint for receiving WhatsApp message statuses and replies.
 *     description: This webhook is used to handle incoming WhatsApp messages, including status updates (sent, delivered, read) and message replies. It updates the status of broadcasted messages and logs incoming replies into the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               object:
 *                 type: string
 *                 description: The object sent by WhatsApp. Should be 'whatsapp' for this event.
 *                 example: "whatsapp"
 *               entry:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     changes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: object
 *                             properties:
 *                               statuses:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       description: The ID of the message.
 *                                       example: "ABCD1234"
 *                                     status:
 *                                       type: string
 *                                       description: The status of the message (sent, delivered, read).
 *                                       example: "sent"
 *                                     timestamp:
 *                                       type: integer
 *                                       description: The timestamp of the status change.
 *                                       example: 1609459200
 *                               messages:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     from:
 *                                       type: string
 *                                       description: The phone number of the sender.
 *                                       example: "+1234567890"
 *                                     type:
 *                                       type: string
 *                                       description: The type of message (e.g., text, image, video).
 *                                       example: "text"
 *                                     text:
 *                                       type: object
 *                                       properties:
 *                                         body:
 *                                           type: string
 *                                           description: The content of the message.
 *                                           example: "Hello, this is a test message"
 *     responses:
 *       200:
 *         description: Webhook received and processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Webhook received and processed"
 *       404:
 *         description: Event not from WhatsApp API or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Event not from WhatsApp API"
 *       500:
 *         description: Internal server error processing the webhook.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.route("/api/v1/webhook").post(leadsController.postWebhookWhatsapp);

/**
 * @swagger
 * /api/v1/webhook:
 *   get:
 *     summary: Webhook verification endpoint for WhatsApp.
 *     description: This endpoint is used to verify the webhook during setup by WhatsApp. It validates the `hub.mode` and `hub.verify_token` parameters and returns a challenge token if the verification is successful.
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         schema:
 *           type: string
 *           example: subscribe
 *         description: The mode of the webhook verification request (should be 'subscribe').
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         schema:
 *           type: string
 *           example: ace1234
 *         description: The token sent by WhatsApp to validate the webhook request.
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         schema:
 *           type: string
 *           example: "1234567890"
 *         description: The challenge token that will be returned if verification is successful.
 *     responses:
 *       200:
 *         description: Webhook verification successful. The challenge token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenge:
 *                   type: string
 *                   example: "1234567890"
 *       403:
 *         description: Forbidden. The verify token did not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid token"
 */
router.route("/api/v1/webhook").get(leadsController.getWebhookWhatsapp);

/**
 * @swagger
 * /api/v1/readSocialInbox:
 *   post:
 *     summary: Updates the read status of a social inbox message.
 *     description: This endpoint allows you to update the "read" status of a specific social inbox message. The `inbox_read_status` field controls whether the message is marked as read or unread.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inbox_id:
 *                 type: integer
 *                 description: The ID of the social inbox message to update.
 *                 example: 123
 *               inbox_read_status:
 *                 type: boolean
 *                 description: The status to set for the inbox message (true for read, false for unread).
 *                 example: true
 *     responses:
 *       200:
 *         description: Inbox message updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Inbox updated successfully"
 *       400:
 *         description: Error occurred while updating the inbox message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Error message here"
 */
router.route("/api/v1/readSocialInbox").post(leadsController.readSocialInbox);

/**
 * @swagger
 * /api/v1/add-to-social-inbox:
 *   post:
 *     summary: Adds a new message to the social inbox via the API.
 *     description: This endpoint adds a new message to the social inbox for a given organization if the message does not already exist. If the message exists, it returns a success message stating that the record is already added.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Request body to add a new message to the social inbox.
 *         schema:
 *           type: object
 *           required:
 *             - orgId
 *             - channelName
 *             - channelId
 *             - postId
 *             - messageType
 *             - createdDate
 *           properties:
 *             orgId:
 *               type: integer
 *               description: The organization ID.
 *               example: 1
 *             channelName:
 *               type: string
 *               description: The name of the channel (e.g., WhatsApp).
 *               example: "WhatsApp"
 *             channelId:
 *               type: string
 *               description: The unique ID of the channel.
 *               example: "whatsapp_channel_123"
 *             postId:
 *               type: string
 *               description: The unique ID of the post/message.
 *               example: "post_12345"
 *             messageType:
 *               type: string
 *               description: The type of message (e.g., incoming, outgoing).
 *               example: "INCOMING"
 *             createdDate:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the message was created.
 *               example: "2024-12-20T14:00:00Z"
 *     responses:
 *       200:
 *         description: Successfully added or already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'Record Added Successfully.'  # If record is added
 *                 # Example message when the record already exists
 *                 message:
 *                   type: string
 *                   example: 'Record Already Added.'
 *       400:
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Missing Data.'
 *       500:
 *         description: Internal server error while adding data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'An error occurred while adding the record.'
 */
router
  .route("/api/v1/add-to-social-inbox")
  .post(leadsController.addToSocialInboxViaApi);

/**
 * @swagger
 * /api/v1/add-to-social-inbox-for-cf-7:
 *   post:
 *     summary: Adds a new message to the social inbox for CF7 form submissions.
 *     description: This endpoint is designed to handle the insertion of messages into the social inbox based on CF7 form submissions. If the message is already in the social inbox, it returns a message indicating that the record is already added.
 *     parameters:
 *       - in: query
 *         name: orgId
 *         required: true
 *         description: The organization ID.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: channelName
 *         required: true
 *         description: The name of the channel (e.g., Website).
 *         schema:
 *           type: string
 *           example: "Website"
 *       - in: query
 *         name: channelId
 *         required: true
 *         description: The unique ID of the channel.
 *         schema:
 *           type: string
 *           example: "website_channel_123"
 *       - in: body
 *         name: body
 *         required: true
 *         description: Request body for adding a message from CF7.
 *         schema:
 *           type: object
 *           required:
 *             - postId
 *             - message
 *             - name
 *             - email
 *           properties:
 *             postId:
 *               type: string
 *               description: The unique ID of the post/message.
 *               example: "post_12345"
 *             message:
 *               type: string
 *               description: The message sent through the form.
 *               example: "I need help with the product."
 *             name:
 *               type: string
 *               description: The name of the person submitting the form.
 *               example: "John Doe"
 *             email:
 *               type: string
 *               description: The email address of the person submitting the form.
 *               example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Successfully added or already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   example: 'Record Added Successfully.'  # If record is added
 *                 # Example message when the record already exists
 *                 message:
 *                   type: string
 *                   example: 'Record Already Added.'
 *       400:
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'Missing Data.'
 *       500:
 *         description: Internal server error while adding data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   example: 'An error occurred while adding the record.'
 */
router
  .route("/api/v1/add-to-social-inbox-for-cf-7")
  .post(leadsController.addToSocialInboxViaApiForCF7);

module.exports = router;
