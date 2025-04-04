const { hub, business } = require('../models');
const db = require('../models');
const businessModel = require('../models/business.model');
const AppError = require('../utils/appError');

const Organization = db.organization;
const Business = db.business;
const Hub = db.hub
const Asset = db.asset

/**
 * Function to create Business into the Database
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */


exports.saveBusinessDetails = async (req, res, next) => {
  // Create a Business
  const business = {
    description: req.body.description,
    descriptionTags: req.body.descriptionTags,
    tagLine: req.body.tagLine,
    organizationOrgId: req.body.orgId,
    competitor1: req.body.competitor1 || '',
    competitor2: req.body.competitor2 || '',
    hubHubId: '',
    assetAssetId: '',
  };
  if (req.body.hubType) {
    const hubInfo = await this.saveHubDetails(req);

    if (hubInfo.success) {
      business.hubHubId = hubInfo.hubId
    }
  }
  if (req.body.assetName) {
    const assetInfo = await this.saveAssetDetails(req);
    business.assetAssetId = assetInfo.assetId
  }
  // Save Organization in the database
  Business.create(business)
    .then((data) => {
      res.send({
        status: 'success',
        data: {
          businessId: data.businessId,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      next(
        new AppError(
          err.message || 'Some error occurred while creating the business.',
          200
        )
      );
    });
};

exports.saveHubDetails = (req) => {
  console.log("saveHub")
  console.log(req.body)
  // Create a asset
  return new Promise((resolve) => {
    const hub = {
      type: req.body.hubType || '',
      url: req.body.hubUrl || '',
      credentials: req.body.credentials || ''
    };

    // Save Organization in the database
    Hub.create(hub)
      .then((data) => {
        resolve({
          success: true,
          hubId: data.hubId
        })
      })
      .catch((err) => {
        console.log("err=================>");
        resolve({
          success: false,
          hubId: ''
        })
      });
  })

};

exports.saveAssetDetails = (req) => {
  // Create a Asset
  return new Promise((resolve) => {
    const asset = {
      name: req.body.assetName || '',
      expiry: req.body.assetExpiry || '',
      credentials: req.body.assetCredentials || ''
    };

    // Save ASSET in the database
    Asset.create(asset)
      .then((data) => {
        resolve({
          success: true,
          assetId: data.assetId
        })
      })
      .catch((err) => {
        console.log(err);
        resolve({
          success: false,
          assetId: ''
        })
      });
  })

};

/**
 * Function to find the organizatin by org_Id
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */

 exports.findById = async (orgId) => {
  const BusinessList = await Business.findOne({
    where: {
      organizationOrgId: orgId,
    }
  })
  return BusinessList
};

exports.getBusinessDetails = async (req, res, next) => {
  try {
    const { orgId } = req.body;
    const busniessData = await this.findById(orgId)
    if (busniessData) {
      let hubData = null
      let businessDetails = {
        businessId: busniessData.businessId,
        description: busniessData.description,
        tagLine: busniessData.tagLine,
        competitor1: busniessData.competitor1,
        competitor2: busniessData.competitor2,
        descriptionTags: busniessData.descriptionTags,
      }
      if (busniessData.hubHubId) {
        hubData = await this.getHubDetails(busniessData.hubHubId)
        businessDetails.hubHubId = busniessData.hubHubId
        businessDetails.type = hubData.type
        businessDetails.url = hubData.url
        businessDetails.credentials = hubData.credentials
      }else{
        businessDetails.hubHubId=null
      }
      if (busniessData.assetAssetId) {
        assetData = await this.getAssetDetails(busniessData.assetAssetId)
        businessDetails.assetAssetId = busniessData.assetAssetId
        businessDetails.assetName = assetData.name
        businessDetails.assetExpiry = assetData.expiry
        businessDetails.assetCredentials = assetData.credentials
      }else {
        businessDetails.assetAssetId=null
      }
      res.send({
        status: 'success',
        data: businessDetails
      })
    }
    else {
      next(new AppError('No Record Found', 200));
    }
  } catch (err) {
    console.log(err.message)
    next(new AppError(`Error retrieving Business`, 200));
  }

}

exports.getHubDetails = async (hubId) => {
  const hubDetails = await Hub.findOne({ where: { hubId } })
  return hubDetails
}

exports.getAssetDetails = async (assetId) => {
  const assetDetails = await Asset.findOne({ where: { assetId } })
  return assetDetails
}

exports.updateBusinessDetails= async (req, res, next) => {
  const { businessId } = req.body;
  try {
    const foundItem = await Business.findOne({ where: { businessId } });
    const updatedItem = {};
    if (!foundItem) {
      next(new AppError('No Record Found', 200));
    } else {
      if(foundItem.hubHubId || foundItem.assetAssetId){
        if(foundItem.hubHubId){
          const hubInfo = await Hub.update(
            {  
              type : req.body.hubType,
              credentials : req.body.credentials,
              url : req.body.hubType.toLowerCase() !== "youtube" ? req.body.hubUrl : ""
            },
            {
              returning: true,
              where: {
                hubId: foundItem.hubHubId
              }
            });
        }else {
          const hubInfo = await this.saveHubDetails(req)
          updatedItem.hubHubId = hubInfo.hubId
        }
        if( foundItem.assetAssetId){
          const assetInfo = await Asset.update(
            { 
              name: req.body.assetName,
              expiry: req.body.assetExpiry,
              credentials: req.body.assetCredentials
            },
            {
              returning: true,
              where: {
                assetId: foundItem.assetAssetId
              }
            });
        }else {
          const hubInfo = await this.saveAssetDetails(req)
          updatedItem.assetAssetId = hubInfo.assetId
        }
        updatedItem.description = req.body.description || foundItem.description;
        updatedItem.descriptionTags = req.body.descriptionTags || foundItem.descriptionTags;
        updatedItem.tagLine = req.body.tagLine || foundItem.tagLine
        updatedItem.competitor1 = req.body.competitor1 || foundItem.competitor1
        updatedItem.competitor2 = req.body.competitor2 || foundItem.competitor2
        const updateRecord = await Business.update(updatedItem, {
          where: { businessId },
        });
        res.send({
          status: 'success',
          message: 'Business Updated Succesfully',
        });
      }else {
        if(req.body.assetName){
          const assetInfo = await this.saveAssetDetails(req)
          updatedItem.assetAssetId = hubInfo.assetId
        }
        if(req.body.hubType){
          const hubInfo = await this.saveHubDetails(req)
          updatedItem.hubHubId = hubInfo.hubId
        }
        updatedItem.description = req.body.description || foundItem.description;
        updatedItem.descriptionTags = req.body.descriptionTags || foundItem.descriptionTags;
        updatedItem.tagLine = req.body.tagLine || foundItem.tagLine
        updatedItem.competitor1 = req.body.competitor1 || foundItem.competitor1
        updatedItem.competitor2 = req.body.competitor2 || foundItem.competitor2
        const updateRecord = await Business.update(updatedItem, {
          where: { businessId },
        });
        res.send({
          status: 'success',
          message: 'Business Updated Succesfully',
        });
      }
    }
  }
  catch(err) {
    next(new AppError(err.message, 200));
  }
}

exports.deleteAssestDetails= async(req, res, next) => {
  try {
    const { orgId } = req.body;
    const busniessData = await this.findById(orgId)
    if (busniessData) {
      const assetAssetId = busniessData.assetAssetId
      const deleteAsset =await Asset.destroy( { where: {assetId: assetAssetId} 
      }) 

      const assetInfo = await business.update(
        { assetAssetId: null },
        {
          returning: true,
          where: {
            organizationOrgId: orgId
          }
        });

        console.log(assetInfo)
        res.send({
          status: 'success',
          message: 'Digital Asset Deleted Succesfully',
        });
    }
  }
  catch(err){
    next(new AppError(err.message, 200));
  }
}