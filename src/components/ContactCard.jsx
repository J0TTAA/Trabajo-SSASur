// src/components/ContactCard.jsx
import React from 'react';

const ContactCard = ({ practitioner }) => {
    const { id, name, identifier } = practitioner.resource;

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        textAlign: 'left',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div style={cardStyle}>
            <h2>{name[0]?.text}</h2>
            <p>ID: {id}</p>
            <p>Identificador: {identifier[0]?.value}</p>
            <p>Familia: {name[0]?.family}</p>
            <p>Dado: {name[0]?.given.join(' ')}</p>
        </div>
    );
};

export default ContactCard;
