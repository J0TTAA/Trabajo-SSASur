// src/views/ContactView.jsx
import React, { useEffect, useState } from 'react';
import ContactList from '../components/ContactList';

const ContactView = () => {
    const [practitioners, setPractitioners] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchPractitioners = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setPractitioners((prev) => [...prev, ...data.entry]);

            // Verifica si hay un enlace para la siguiente página
            if (data.link && data.link.length > 0) {
                const nextPage = data.link.find(link => link.relation === 'next');
                if (nextPage) {
                    await fetchPractitioners(nextPage.url); // Llama recursivamente para la siguiente página
                }
            }
        } catch (error) {
            console.error('Error fetching practitioners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPractitioners('https://cdr-api.ssasur.cl/fhir/prod2/baseR4/Practitioner');
    }, []);

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <h1>Lista de Contactos</h1>
            <ContactList practitioners={practitioners} />
        </div>
    );
};

export default ContactView;
