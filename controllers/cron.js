const cron = require('node-cron');
const postController = require('./postController');

exports.cronJobs = () => {
  console.log('[Cron Init] ✅ cronJobs() initialized at', new Date());

  try {
    // 🔁 Facebook, Instagram, LinkedIn, WhatsApp Broadcast Cron — every 2 mins
    cron.schedule('*/2 * * * *', async () => {
      const timestamp = new Date().toISOString();
      console.log(`[Cron Trigger] 🕐 Broadcast cron started at ${timestamp}`);

      try {
        const postDetailArray = await postController.getScheduledCampaignPosts(); // Your own logic
        console.log(`[Broadcast] 📦 Fetched ${postDetailArray.length} campaign posts`);

        for (const postDetail of postDetailArray) {
          // Facebook
          try {
            console.log(`[Facebook] 🚀 Sending post for campaign ${postDetail.campaignContentPostID}`);
            const fb = await postController.addFacebookPost(
              postDetail.pageId,
              postDetail.description,
              postDetail.url,
              postDetail.accessToken,
              postDetail.campaignContentPostID,
              postDetail.name,
              postDetail.assetCredentials,
              postDetail.tags
            );
            console.log(`[Facebook] ✅ Success: ${JSON.stringify(fb)}`);
          } catch (err) {
            console.error(`[Facebook] ❌ Error: ${err.message}`, postDetail);
          }

          // Instagram
          try {
            console.log(`[Instagram] 🚀 Sending post for campaign ${postDetail.campaignContentPostID}`);
            const insta = await postController.addInstagaramPost(
              postDetail.pageId,
              postDetail.description,
              postDetail.url,
              postDetail.accessToken,
              postDetail.campaignContentPostID,
              postDetail.name,
              postDetail.assetCredentials,
              postDetail.tags
            );
            console.log(`[Instagram] ✅ Success: ${JSON.stringify(insta)}`);
          } catch (err) {
            console.error(`[Instagram] ❌ Error: ${err.message}`, postDetail);
          }

          // LinkedIn
          try {
            console.log(`[LinkedIn] 🚀 Sending post for campaign ${postDetail.campaignContentPostID}`);
            const linkedin = await postController.addLinkendinPost(
              postDetail.pageId,
              postDetail.description,
              postDetail.url,
              postDetail.accessToken,
              postDetail.campaignContentPostID,
              postDetail.name,
              postDetail.assetCredentials,
              postDetail.tags
            );
            console.log(`[LinkedIn] ✅ Success: ${JSON.stringify(linkedin)}`);
          } catch (err) {
            console.error(`[LinkedIn] ❌ Error: ${err.message}`, postDetail);
          }

          // WhatsApp
          try {
            console.log(`[WhatsApp] 🚀 Broadcasting for campaign ${postDetail.campaignContentPostID}`);
            const whatsapp = await postController.sendWhatsappBroadcast(
              postDetail.pageId,
              postDetail.description,
              postDetail.url,
              postDetail.accessToken,
              postDetail.campaignContentPostID,
              postDetail.name,
              postDetail.assetCredentials,
              postDetail.tags
            );
            console.log(`[WhatsApp] ✅ Success: ${JSON.stringify(whatsapp)}`);
          } catch (err) {
            console.error(`[WhatsApp] ❌ Broadcast failed: ${err.message}`, postDetail);
          }
        }

        console.log(`[Broadcast Cron] ✅ Completed cycle at ${new Date().toISOString()}`);
      } catch (err) {
        console.error('[Broadcast Cron] ❌ Execution error:', err.message);
      }
    });

    // 📥 Another Cron Example — Every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      const timestamp = new Date().toISOString();
      console.log(`[Campaign Sync Cron] 🔄 Started at ${timestamp}`);

      try {
        const result = await postController.syncCampaignStatus(); // Replace with your real method
        console.log(`[Campaign Sync] ✅ Result:`, result);
      } catch (err) {
        console.error('[Campaign Sync] ❌ Error:', err.message);
      }
    });

    // 🕒 Optional: Daily cleanup at midnight
    cron.schedule('0 0 * * *', async () => {
      const timestamp = new Date().toISOString();
      console.log(`[Cleanup Cron] 🧹 Running cleanup at ${timestamp}`);

      try {
        const cleanupResult = await postController.expireOldCampaigns(); // Replace as needed
        console.log(`[Cleanup Cron] ✅ Done:`, cleanupResult);
      } catch (err) {
        console.error('[Cleanup Cron] ❌ Failed:', err.message);
      }
    });

    console.log('[Cron Setup] 🟢 All cron jobs scheduled successfully');
  } catch (err) {
    console.error('[Cron Setup Error] 🔥 Failed to initialize cronJobs:', err.message);
  }
};
