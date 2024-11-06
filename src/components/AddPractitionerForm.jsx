import React, { useState } from "react";

const AddPractitionerForm = () => {
  const [formData, setFormData] = useState({
    familyName: "",
    givenName1: "",
    phone: "",
    gender: "",
    addressLine: "",
    qualificationCode: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const practitionerData = {
      resourceType: "Practitioner",
      active: true,
      name: [{
        family: formData.familyName,
        given: [formData.givenName1]
      }],
      telecom: [{
        system: "phone",
        value: formData.phone
      }],
      gender: formData.gender,
      address: [{
        line: [formData.addressLine]
      }],
      qualification: [{
        code: {
          text: formData.qualificationCode
        }
      }]
    };

    try {
      const response = await fetch("http://localhost:8080/fhir/Practitioner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(practitionerData),
      });

      if (response.ok) {
        alert("Practitioner added successfully!");
      } else {
        alert("Failed to add practitioner.");
      }
    } catch (error) {
      console.error("Error adding practitioner:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Family Name: </label>
        <input
          type="text"
          name="familyName"
          value={formData.familyName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Given Name: </label>
        <input
          type="text"
          name="givenName1"
          value={formData.givenName1}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Phone: </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Gender: </label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label>Address Line: </label>
        <input
          type="text"
          name="addressLine"
          value={formData.addressLine}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Qualification Code: </label>
        <input
          type="text"
          name="qualificationCode"
          value={formData.qualificationCode}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Add Practitioner</button>
    </form>
  );
};

export default AddPractitionerForm;
