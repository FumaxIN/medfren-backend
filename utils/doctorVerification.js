const axios = require('axios');
const cheerio = require('cheerio');

async function verifyDoctor(nmcNumber = null, dmcNumber = null, doctorData) {
    try {
        if (!nmcNumber && !dmcNumber) {
            return false;
        }
        const doctorName = doctorData.name.trim().replace(/\s+/g, '').toLowerCase();
        if (dmcNumber) {
            const response = await axios.get(`https://delhimedicalcouncil.org/home/regi_search_submit?Regd_ID=${dmcNumber}&Type=FRS`);
            const html = response.data;

            const $ = cheerio.load(html);
            const doctorNameElement = $('div:contains("Doctors Name :") + div');
            const doctorName_fetched = doctorNameElement.text().trim().replace(/\s+/g, '').toLowerCase();

            return doctorName_fetched === doctorName;
        }

        if (nmcNumber) {
            const request_body = {
                "registrationNo": nmcNumber
            }
            const headers = {
                'Content-Type': 'application/json',
            }
            const response = await axios.post('https://www.nmc.org.in/MCIRest/open/getDataFromService?service=searchDoctor', request_body, {headers});
            const data = response.data;

            const firstNames = data.map(item => item.firstName.replace(/\s+/g, '').toLowerCase());

            return firstNames.includes(doctorName);
        }

    } catch (error) {
        return true;
    }
}

module.exports = {verifyDoctor}