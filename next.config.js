/** @type {import('next').NextConfig} */

module.exports = {
  async headers() {
    return [
      {
        source: "/api/relay/([0-9a-fA-F]{4})",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Headers", value: "Accept, Authorization, Content-Type, Origin" },
          { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ]
      }
    ]
  }
};
