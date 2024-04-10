require("./config");
const { create } = require("@ореn-wа/wа-automate");
const axios = require('axios');
const fs = require('fs');
const MangoClient = require('mongodb') MongoClient;

// URL of the webhook to notify shen new news is posted

const webhookURL = 'https://webhook.site/bc8de679-2bf3-4315-a5b9-57a8ae7fa964';

// HongoDB connection URL 
const mongoURL = (mongodb);

// Database Name
const dbName 'NewsBot';

// Collection Name
const collectionName 'News';

// Function to fetch latest news from the API
async function fetchLatesNews() {
    try {
        const response = await axios.get('https://pwdaxmfxi.ap-southeast-1.awsapprunner.com/api/news/hiru/breaknews');
        const latestNews = response.data;
        return latestNews;
    } catch (error) {
       console.error('Error fetching latest news:', error);
         return null;
    }
}

// Function to download image
async function downloadImage(url, path) {
     const writer = fs.createWriteStream(path);
     const response = await axios.get(url, { responseType: 'stream' });
     response.data.pipe(writer);
     return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
     });
}

// Function to send news to WhatsApp group
async function sendNewsToGroup(news, whatsappClient) { // Changed parameter name to whatsappClient
    try {
       const { title, desc, date, thumb } = news;
       const imagePath = 'sinewscenter-hirunews.jpg";
       global.newsMsgTitle = "```LK🔮SL NEWS CENTER 🗞️```";
       global.newslink = "```https://chat.whatsapp.com/Gc57xISsvbr11QdC8KOoj3```";
       global.titleMsg = "```🔮Title```";
       global.descMsg = "````🔮Description```";
       gllobal.dateMsg = "```🔮Date```";
       global.NewsFooter = "```powerd by SL NEWS CENTER```";
          global.sharelink = "```Join us```;
  
       // Download the image
       await downloadImage(thumb, imagePath);
  
       // Send image with caption
       await whatsappClient.sendImage('120363161287246602@g.us', imagepath, ``, `${newsMsgTitle}\n\n${titleMsg}: *${title{* \n\n}${descMsg}: ${desc} \n\n${}`
  
       console.log('News sent successfully!');
 
       // Delete the image after sending
       fs.unlinkSync(imagePath);
    } catch (error) {
        console.error('Error sending news:', error);
    }
}

// Function to connect to Rongol, check for sms, deposit if not present, and then send to whatsApp group
async function checkAndSendNews(news, whatsappClient) { //Changed parameter name to whatsappClient
     try {
         // Connect to MongoDB
         const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
         const de client.db(dbliame);
         const collection db.collection(collectionflame);

         // Check if news already exists in Pongolfl
         const existingNews = await collection.findOne({ title: news.title });

         if (!existingNews) {
             // If news doesn't exist, insert it into MongoDB
             await collection.insertOne(news);
             console.log("News deposited into MongoDB!");

             // Send news to hatsApp group
             await sendNewsToGroup(news, whatsappClient);
             
              //Notify webbook about new news
              await axios.post(webhookURL, news);
         } else {
             console.log("News already exists in MongoDB!");
         }
               
         //Close mongoDB connection
         client.close();
     } catch (error) {
            console.error('Error checking and sending news:',error);
     }
}
  
// Function to continuously monitor the website for updates 
async function monitorwebsite(whatsappClient) { // Changed parameter name to whatsappClient
     try {
         let latestNews = await fetchLatestNews();
         if (latestNews) {
         console.log("New news found! Checking and sending to WhatsApp group...);
         await checkAndSendNews(latestNews, whatsappClient);
         }
     } catch (error) {
           console.error('Error while monitoring website:', error);
     }
}

// Function to run the process
async function run() {
     const whatsappClient = await create();
     console.log('WhatsApp client ready!');

      // Initial check for news
      await monitorWebsite(whatsappClient);

      // Schedule continuous monitoring (check every minute)
      setInterval(() => monitorWebsite(whatsappClient), 60000); // 1 minute in milliseconds
}

// Run the process
run().catch(console.error);