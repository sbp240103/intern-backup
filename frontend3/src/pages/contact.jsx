import React, { useContext, useEffect, useState } from 'react';
import './c/Cont.css';
import { UserDataContext } from '../context/UserContext';

const Contact = () => {
  const { user } = useContext(UserDataContext); // Access user from context
  const [summary, setSummary] = useState(''); // State to store the summary
  const [result, setResult] = useState('');

  // Fetch the summary from the database or localStorage when the component loads
  useEffect(() => {
    console.log('User email:', user.email); // Debugging log to check if user.email is available

    const fetchSummary = async () => {
      try {
        // Check if the summary is already in localStorage
        const savedSummary = localStorage.getItem('summary');
        if (savedSummary) {
          setSummary(savedSummary); // Use the summary from localStorage
          console.log('Summary loaded from localStorage:', savedSummary); // Debugging log
          return;
        }

        // If not in localStorage, fetch it from the backend
        const response = await fetch(`http://localhost:3000/catalog/author/get-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }), // Send the user's email to fetch the summary
        });

        const data = await response.json();

        if (response.ok) {
          setSummary(data.summary); // Set the fetched summary in the state
          localStorage.setItem('summary', data.summary); // Save the summary to localStorage
          console.log('Summary fetched from backend and saved to localStorage:', data.summary); // Debugging log
        } else {
          console.error('Error fetching summary:', data);
        }
      } catch (error) {
        console.error('Error in fetchSummary:', error);
      }
    };

    if (user.email) {
      fetchSummary(); // Fetch the summary only if the user's email is available
    } else {
      console.warn('User email is not available'); // Debugging log if user.email is undefined
    }
  }, [user.email]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult('Updating...');

    try {
      const response = await fetch('http://localhost:3000/catalog/author/update-summary', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email, // Identify the record by email
          summary: summary, // Update the summary field
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult('Summary updated successfully');
        alert('Summary updated successfully in the database');
        localStorage.setItem('summary', summary); // Save the updated summary to localStorage
        console.log('Updated summary saved to localStorage:', summary); // Debugging log
      } else {
        console.error('Error updating summary:', data);
        setResult('Failed to update the summary');
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      setResult('An error occurred while updating the summary');
    }
  };

  const onConvertToGoogleDoc = async () => {
    try {
      const response = await fetch('http://localhost:3000/google/create-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: summary }), // Send the text to the backend
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Google Docs file created: ${data.url}`);
        window.open(data.url, '_blank'); // Open the Google Docs file in a new tab
      } else {
        console.error('Error creating Google Docs file:', data);
        alert('Failed to create Google Docs file');
      }
    } catch (error) {
      console.error('Error in onConvertToGoogleDoc:', error);
      alert('An error occurred while creating the Google Docs file');
    }
  };

  const onUploadToDrive = async () => {
    try {
      const response = await fetch('http://localhost:3000/google/upload-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: summary }), // Send the text to the backend
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Google Docs file uploaded to your Drive: ${data.url}`);
        window.open(data.url, '_blank'); // Open the Google Docs file in a new tab
      } else {
        console.error('Error uploading Google Docs file:', data);
        alert(data.message || 'Failed to upload Google Docs file');
      }
    } catch (error) {
      console.error('Error in onUploadToDrive:', error);
      alert('An error occurred while uploading the Google Docs file');
    }
  };

  return (
    <div id="contact" className="contact">
      <div className="contact-container">
        <form onSubmit={onSubmit} className="contact-right">
          <label htmlFor="">Write your message here</label>
          <textarea
            name="message"
            rows="15"
            placeholder="Enter your message"
            value={summary} // Bind the summary state to the textarea
            onChange={(e) => setSummary(e.target.value)} // Update the summary state on change
          ></textarea>
          <button type="submit" className="contact-submit Save-as-Draft">
            Save as Draft
          </button>
          <button
            type="button"
            className="contact-submit Upload-to-Drive"
            onClick={onConvertToGoogleDoc} // Call the function to convert to Google Docs
          >
            Convert to Google Docs
          </button>
          <button
            type="button"
            className="contact-submit Upload-to-Drive"
            onClick={onUploadToDrive} // Call the function to upload to Google Drive
          >
            Upload to Google Drive
          </button>
        </form>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default Contact;