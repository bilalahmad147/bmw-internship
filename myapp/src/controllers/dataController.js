// Controller for /data
exports.getData = (req, res) => {
  const sampleData = {
    message: "This is the /data route",
    timestamp: new Date(),
    items: ["item1", "item2", "item3"],
  };
  res.json(sampleData);
  console.log("Data route accessed");
};
