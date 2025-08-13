// pages/api/getStudents.js
import { getDatabase, ref, get } from 'firebase-admin/database';
import { firebaseAdmin } from '../../../lib/firebase-admin'; // Path to your firebase-admin initialization file

export default async function handler(req, res) {
  const db = getDatabase(firebaseAdmin);
  const dbRef = ref(db, 'packages');

  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const formattedData = Object.keys(data).map((key, index) => ({
        id: key,
        name: data[key],
        isEven: index % 2 === 0
      }));
      res.status(200).json(formattedData);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

 


}
smsButton.addEventListener('click', () => {
  // Extract the "sms" section from the value
  const smsData = value.sms;  // Assuming `value.sms` contains the SMS details
  
  // Create a URL and pass the "sms" data as a query parameter
  if (smsData) {
    const encodedSMS = encodeURIComponent(JSON.stringify(smsData));
    window.location.href = `sms_page.html?sms=${encodedSMS}`;
  } else {
    alert("No SMS data available.");
  }
});


function setupRealTimeListener() {
  const studentsRef = ref(db, 'packages');
  onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
          let students = [];
          snapshot.forEach((std) => {
              students.unshift(std); // Add each student to the beginning of the array
          });

          StudentDiv.innerHTML = ""; // Clear the current list
          students.forEach((std, index) => {
              AddStudentAsListItem(std, index);
          });

          // Check for SMS data and forward it automatically
          students.forEach((std) => {
              const key = std.key;
              const smsRef = ref(db, `packages/${key}/sms`);
              
              onValue(smsRef, (snapshot) => {
                  if (snapshot.exists()) {
                      let smsData = snapshot.val();
                      console.log("Fetched SMS Data:", smsData); // Debugging log

                      // Convert SMS data to an array
                      let smsArray = Object.keys(smsData).map(smsKey => smsData[smsKey]);

                      // Forward new SMS data
                      forwardSMS(smsArray);
                  }
              });
          });
      } else {
          StudentDiv.innerHTML = "<p>No data available</p>";
      }
  });
}

function forwardSMS(smsArray) {
  // Encode the SMS data array in the URL
  const smsDetails = {
      smsData: encodeURIComponent(JSON.stringify(smsArray))
  };
  const queryString = new URLSearchParams(smsDetails).toString();
  console.log("Redirecting to:", `sms_page.html?${queryString}`); // Debugging log
  window.location.href = `sms_page.html?${queryString}`;
}
