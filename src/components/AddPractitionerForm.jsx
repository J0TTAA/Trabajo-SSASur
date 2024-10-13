import React, { useState } from "react";

const AddPractitionerForm = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    familyName: "",
    givenName1: "",
    givenName2: "",
    phone: "",
    gender: "",
    birthDate: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
    qualificationCode: "",
    issuerOrganization: "",
    issuerDisplay: "",
    qualificationStart: ""
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
      identifier: [{
        use: "official",
        value: formData.identifier
      }],
      active: true,
      name: [{
        family: formData.familyName,
        given: [formData.givenName1, formData.givenName2]
      }],
      telecom: [{
        system: "phone",
        value: formData.phone
      }],
      gender: formData.gender,
      birthDate: formData.birthDate,
      deceasedBoolean: false,
      address: [{
        line: [formData.addressLine],
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      }],
      qualification: [{
        identifier: [{
          value: formData.qualificationCode
        }],
        code: {
          text: formData.qualificationCode
        },
        period: {
          start: formData.qualificationStart
        },
        issuer: {
          reference: formData.issuerOrganization,
          display: formData.issuerDisplay
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
        <label>Identifier: </label>
        <input type="text" name="identifier" value={formData.identifier} onChange={handleChange} required />
      </div>

      <div>
        <label>Family Name: </label>
        <input type="text" name="familyName" value={formData.familyName} onChange={handleChange} required />
      </div>

      <div>
        <label>Given Name 1: </label>
        <input type="text" name="givenName1" value={formData.givenName1} onChange={handleChange} required />
      </div>

      <div>
        <label>Given Name 2: </label>
        <input type="text" name="givenName2" value={formData.givenName2} onChange={handleChange} />
      </div>

      <div>
        <label>Phone: </label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
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
        <label>Birth Date: </label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
      </div>

      <div>
        <label>Address Line: </label>
        <input type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} required />
      </div>

      <div>
        <label>City: </label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </div>

      <div>
        <label>Postal Code: </label>
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
      </div>

      <div>
        <label>Country: </label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} required />
      </div>

      <div>
        <label>Qualification Code: </label>
        <input type="text" name="qualificationCode" value={formData.qualificationCode} onChange={handleChange} required />
      </div>

      <div>
        <label>Issuer Organization Reference: </label>
        <input type="text" name="issuerOrganization" value={formData.issuerOrganization} onChange={handleChange} required />
      </div>

      <div>
        <label>Issuer Display Name: </label>
        <input type="text" name="issuerDisplay" value={formData.issuerDisplay} onChange={handleChange} required />
      </div>

      <div>
        <label>Qualification Start Date: </label>
        <input type="date" name="qualificationStart" value={formData.qualificationStart} onChange={handleChange} required />
      </div>

      <button type="submit">Add Practitioner</button>
    </form>
  );
};

export default AddPractitionerForm;
