exports.handler = async (event) => {
  console.log("🚀 Campaign trigger event:", event);
  return { statusCode: 200, body: "Campaign triggered" };
};
