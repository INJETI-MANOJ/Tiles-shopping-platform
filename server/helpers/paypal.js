const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: 'sandbox', // or 'live'
  client_id: 'AWK4KZYiKnbrLfa23Er8qyZwXxPWzjeuHOB2hu8VNdXIV0NF8U8vqq9i0EId0PI6erc2tYviaHnYSHhb',
  client_secret: 'EMRcoJCG7XxQYFyCHBD1-ieYelPhxgwoCvEeyuVA7VTjqol7ij3AOyAaVcm0paFRJRHKVdFNbD6euAUR',
});

module.exports = paypal;