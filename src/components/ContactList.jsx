// src/components/ContactList.jsx
import React from 'react';
import ContactCard from './ContactCard';

const ContactList = ({ practitioners }) => {
    return (
        <div>
            {practitioners.map((practitioner) => (
                <ContactCard key={practitioner.resource.id} practitioner={practitioner} />
            ))}
        </div>
    );
};

export default ContactList;
