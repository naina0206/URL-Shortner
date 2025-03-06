const express=require('express');

const router=express.Router();
const {generateNewShortURL,getAnalytics}=require('../controllers/url');


router.post('/url',generateNewShortURL);
router.get('/url/analytics/:shortId',getAnalytics );
module.exports=router;