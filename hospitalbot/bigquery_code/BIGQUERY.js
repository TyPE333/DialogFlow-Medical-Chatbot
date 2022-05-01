
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');
const { BigQuery } = require('@google-cloud/bigquery');//l1


// Enter your calendar ID below and service account JSON below
const calendarId = "7vl07tl9euatrt81ruc5vcvtu4@group.calendar.google.com";
const serviceAccount ={
  "type": "service_account",
  "project_id": "newagent-utgf",
  "private_key_id": "3f3fcfa7f71e7c7dd5b6bf89173b88a97b2a70a3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxWKQVmK9AE36w\nuESNArHUlleTLadgyosEKiysB/naGS9/QzC9kBC6s7NgQmp2tQ1OywUEA3RyhVgY\nBnxnjXqQ5Jwd0F9UkqorqYd2G4MfLvvDngexQv55qiPFCUceE0b+BsHO6i1le1nk\nHKwbvej8Z6RJ/q0wujxRJjdrylHxKL0lTrlxvzGyxp3l6YNsaXGB+I53oJNe80We\nVyHCu+YtDO3aZcgXc6Io1ZcudsJJiE671zayKbsJ5Do6X0mtYvH2Zz9jqr/tlC8b\n0aDS3wKldrDEE6ks5AcN+wdY82PuIlZfea3KweRDtKCOh57bAEQcRnULnQMYN44I\nmpfZdaYJAgMBAAECggEAFhmPMlfEDa6VkjfBkcw8/9pk+w9simMYaWzzWH69SSCW\nqtEN1lmJFChc7okS6PcNO6fmA0bbmy0jD19jilNMQO5pcU0BoYbjU4Hn7Qpm+nBU\nPwocOEqPw/aKnZJXPUK2t+TSAFMYqXWdJpAszF+L6e7lFLQlaJXp+qInXt8n+0QH\nOhHAQDUt3jieVe9wE0L3rT0xYRFNPrhXBCFTwMgpBg/Xqdo9n3V1o6lYdnoA/2bO\nEpurUV0wXLOECxAlej+2v4eCUEyCZX1dT0+t0yVc2jnMeRnvHmy/3xxtEfd8YmYv\nXBLdaW4GteYk+gbNbHoKfsKClmnpSgD/AAl5c5LfXwKBgQDownk/LyUy67upXzFj\nINXt3AqC1OZNShGQg3vMc1m1hLSbTbB/bRLieml6U27z6zfH6xerICl9829TWbeI\nJgX2DJcfnESsE02LliAI0LaFXWDP3PP1XrIHcwkB+fk46OliYmpISmRFq/KkOQHU\nBZ4yTRtfDruC+VpXSpv2tq3PfwKBgQDDDcFpQDiu+RO+/C5RKb8729F4N18P2Lhh\nYT/ytPbFu89eXxzbpwwjBOmWitJTLjBBpGALuTBWcJtx5rGnp9pWhctn/bo4dxPe\niAeFKhJhPVLfR/tJZ6UREHVkkrUR3lyAit0faY2BzGCHWXwCNAd0GhCdDmHw2DIF\naENop07OdwKBgANseOQZCW8KUKRZJhzTKtJo3i62evzADioWBQgo2jT1UsLGDcaS\nECkMq+iEuakU2Kk0KBD4VCPqJMURGMYD6SqJXN+2KLxvPEDFYItApq6nhPkJwvzk\n+7FoW8WPq77OjkBIOk/96COuN896lzBLNNyAjdqEGPYAPPfzvP+QCFZ5AoGAMjA0\n5v8WVrdSRF8hD9M9GIrcICGnPS2Xa78ZNDsqEADeP7sbcs1Nyyj1bb30lmCZHBrO\nd9XDwUoiRTGF3szK2l580xovM144Z5b60GHd7tVXoIol92JKz9Q7UJCLNLjRdmXE\ntdN0DMToxYrZ5Ls8e7xFMBRGUTFf1ZJZXfFGzssCgYAqtQvbHSn3gFfUmuuEUrUi\nC7IG2wFPvHInsl58x2qyKH6ixJy01OLWildWA51pVnGkB5hb2Wb8ec8ETC2itrYx\nFHbFrJEiH4g9e6q5tcSBrtCf75KfkaZWEty92HY4tG2b6xFy9eZ3YHAchF676jgP\nu9JdegF3j8CM3jPQcWXQrw==\n-----END PRIVATE KEY-----\n",
  "client_email": "hosbot@newagent-utgf.iam.gserviceaccount.com",
  "client_id": "102044707996315223201",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/hosbot%40newagent-utgf.iam.gserviceaccount.com"
}

; // Starts with {"type": "service_account",...

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZone = 'Asia/Colombo';
const timeZoneOffset = '+05:30';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log("Parameters", agent.parameters);
  const appointment_type = agent.parameters.AppointmentSpeciality;
  function makeAppointment (agent) {
    // Calculate appointment start and end datetimes (end = +1hr from start)
    const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('+')[0] + timeZoneOffset));
    const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
    const appointmentTimeString = dateTimeStart.toLocaleString(
      'en-US',
      { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
    );
  
    // Check the availibility of the time, and make an appointment if there is time on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
      agent.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`);
          // Insert data into a table
      addToBigQuery(agent, appointment_type);
    }).catch(() => {
      agent.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
    });
  }

  let intentMap = new Map();
  intentMap.set('Scheduling Appointments', makeAppointment);
  agent.handleRequest(intentMap);
});


function addToBigQuery(agent, appointment_type) {
    const date_bq = agent.parameters.date.split('T')[0];
    const time_bq = agent.parameters.time.split('T')[1].split('+')[0];
    /**
    * TODO(developer): Uncomment the following lines before running the sample.
    */
    const projectId = 'newagent-utgf'; 
    const datasetId = "newagent-utgf.appointments";
    const tableId = "newagent-utgf.appointments.calendar";
    const bigquery = new BigQuery({
      projectId: projectId
    });
   const rows = [{Type: appointment_type ,Date: date_bq, Time: time_bq}];
  
   bigquery
  .dataset(datasetId)
  .table(tableId)
  .insert(rows)
  .then(() => {
    console.log(`Inserted ${rows.length} rows`);
  })
  .catch(err => {
    if (err && err.name === 'PartialFailureError') {
      if (err.errors && err.errors.length > 0) {
        console.log('Insert errors:');
        err.errors.forEach(err => console.error(err));
      }
    } else {
      console.error('ERROR:', err);
    }
  });
  agent.add(`Added ${date_bq} and ${time_bq} into the table`);
}

function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
  return new Promise((resolve, reject) => {
    calendar.events.list({
      auth: serviceAccountAuth, // List events for time period
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there is a event already on the Calendar
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: appointment_type +' Appointment', description: appointment_type,
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd}}
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}
