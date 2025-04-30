const express = require('express');
const orgRouter = require('./routes/orgRoutes');
const teamRouter = require('./routes/teamRoutes');
const campaignRouter = require('./routes/campaignRoutes');
const AppError = require('./utils/appError');
const globalErrorHanlders = require('./controllers/errorController');
const configs = require('./config/config.json');
const RoleRouter = require('./routes/roleRoutes');
const agencyRouter = require("./routes/agencyRoutes")
const BusinessRouter = require('./routes/businessRoutes')
const AnalyticsRouter = require('./routes/analyticsRoutes')
const PostRouter = require('./routes/postRoutes')
const cronJobController = require("./controllers/cron")
const LeadsRouter = require("./routes/leadsRoutes");
const oemRoutes = require('./routes/oemRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const regionRoutes = require('./routes/regionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const businessDetailsRoutes = require('./routes/businessDetailsRoutes');
const workflowRoutes = require('./routes/campaignApprovalWorkflowRoutes');
const strategyRoutes = require('./routes/campaignStrategyTemplateRoutes');
const invoiceRoutes = require('./routes/invoiceDetailsRoutes');
const dealerRoutes = require('./routes/dealerDetailsRoutes');






swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");

const app = express();
const cors = require("cors");

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', ' X-Requested-With');
  next()
});


app.use((req, res, next) => {
  const auth = { login: configs.USERNAME, password: configs.PASSWORD };
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  if (login && password && login === auth.login && password === auth.password) {
    next();
  } else if(req.originalUrl.includes("webhook") || req.originalUrl.includes("docs")) {
    next();
  } else {
    res.send({ statusCode: 500, message: 'Authentication Failed.' });
  }
});

app.use(agencyRouter);
app.use(orgRouter);
app.use(teamRouter);
app.use(campaignRouter);
app.use(RoleRouter);
app.use(BusinessRouter);
app.use(PostRouter);
app.use(AnalyticsRouter)
app.use(LeadsRouter);
app.use(oemRoutes);
app.use(zoneRoutes);
app.use(regionRoutes);
app.use(budgetRoutes);
app.use(businessDetailsRoutes);
app.use(workflowRoutes);
app.use(strategyRoutes);
app.use(invoiceRoutes);
app.use(dealerRoutes);

const options = {
  definition: {
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on the server1`, 404));
});

cronJobController.cronJobs()

app.use(globalErrorHanlders);






module.exports = app;
