# Sistema de Gestión de Protocolos y Derivaciones

## Descripción General del Proyecto

### Objetivo
Este proyecto tiene como objetivo crear un sistema digital para agilizar el acceso a información relacionada con protocolos médicos, bases de datos de referentes clave, y la carpeta de prestaciones de cada centro de salud en el Servicio de Salud Araucanía Sur. Además, se busca facilitar el flujo de derivaciones interconsultas entre los médicos y especialistas, mejorando la eficiencia y la conectividad entre las distintas áreas del servicio.

### Características
- **Acceso a protocolos médicos**: Los médicos podrán acceder a información actualizada sobre protocolos de tratamiento y procedimientos médicos.
- **Base de datos de referentes clave**: Información actualizada sobre los centros de salud, sus servicios y profesionales.
- **Aceso a especialidades segun especialidad**
el usuario podra encontra que las ubicaciones donde se imparten las especialidades.
- **Interfaz amigable y funcional**: El sistema está diseñado para ser intuitivo, optimizando la experiencia de usuario en función de la facilidad de uso.

### Flujo de la aplicación
El usuario inicia sesión en el sistema y puede acceder a las distintas funcionalidades:

1. **Consultas de protocolos**: Buscar protocolos médicos por especialidad.< y patologia.
2. **Consulta de especialidad y sus ubicaciones** : Buscar las ubicaciones donde de imparten ciertas especialidades 
3. **Busqueda de medico o trabajador** : se podra buscar en una cartera de contactos a los profesionales vinculado a la organizacio para facilitar un contacto con ellos 


## Instalación y Configuración

### Requisitos previos
Para ejecutar este proyecto, asegúrate de tener instaladas las siguientes herramientas:
- Node.js
- npm o yarn
### librerias importantes
- material UI
- leaflet Map 
- las demas se pueden ver en el package.json

### Estructura de Archivos
src/
  components/       # Componentes reutilizables como botones, formularios, etc.
  assets/           # Archivos estáticos como imágenes, fuentes, etc.
  views/            # Vistas o páginas que corresponden a rutas

## Componentes

### ContactCard

**Descripción**:  
El componente `ContactCard` muestra los detalles de contacto de un profesional, incluyendo nombre, teléfono, correo electrónico, dirección, género y calificación. Además, ofrece botones para editar o eliminar el contacto.

**Propiedades**:
- **practitioner**: `Object`  
  Datos del profesional a mostrar.
  - `id`: `string`  
    Identificador único del profesional.
  - `name`: `Array<Object>`  
    Detalles del nombre (primer y apellido).
  - `telecom`: `Array<Object>`  
    Datos de contacto, como teléfono y correo electrónico.
  - `address`: `Array<Object>`  
    Dirección del profesional (línea de dirección, ciudad, código postal, país).
  - `gender`: `string`  
    Género del profesional.
  - `qualification`: `Array<Object>`  
    Calificación profesional, con detalles sobre el cargo.

- **onDelete**: `function`  
  Función para eliminar el contacto, pasando el ID del profesional.

- **onEdit**: `function`  
  Función para editar el contacto, pasando el objeto completo del profesional.

**Estado (State)**:  
El componente no mantiene estado interno, ya que depende completamente de las propiedades pasadas desde el componente padre.



### ContactList

**Descripción**:  
El componente `ContactList` muestra una lista de tarjetas de contacto para cada profesional, utilizando el componente `ContactCard` para presentar la información de cada uno de los profesionales.

**Propiedades**:
- **practitioners**: `Array<Object>`  
  Lista de profesionales de la salud.  
  - Cada objeto de la lista debe tener las propiedades definidas en `ContactCard`, como `id`, `name`, `telecom`, `address`, `gender`, y `qualification`.

- **onDelete**: `function`  
  Función para manejar la eliminación de un profesional.

- **onEdit**: `function`  
  Función para manejar la edición de un profesional.

**Estado (State)**:  
El componente no mantiene estado interno, ya que depende completamente de las propiedades pasadas desde el componente padre.

## Vistas

# Componente `ContacView`

# Gestión de Contactos

Este proyecto permite gestionar contactos de practitioners (profesionales de la salud) mediante un servidor FHIR. Permite agregar, editar, eliminar y filtrar contactos por diferentes criterios.

## Descripción

La vista de **Contactos** permite interactuar con una lista de contactos (practitioners) donde puedes realizar las siguientes acciones:
- Ver la lista de contactos.
- Aplicar filtros de búsqueda por nombre, cargo, especialidad, y establecimiento.
- Agregar un nuevo contacto.
- Editar un contacto existente.
- Eliminar un contacto.

### Funcionalidades
- **Filtros de búsqueda**: Permite buscar contactos por nombre, cargo, especialidad y ubicación.
- **Agregar/Editar Contacto**: Abre un modal con un formulario para agregar o editar los datos de un contacto.
- **Eliminar Contacto**: Permite eliminar un contacto de la lista.

### Componentes
#### `Contactos`

Este componente es el principal de la vista de contactos. Muestra la lista de practitioners y ofrece la posibilidad de filtrarlos, agregar, editar o eliminar contactos.

##### Estados

- **practitioners**: Almacena la lista completa de contactos obtenida del servidor FHIR.
- **filteredPractitioners**: Almacena los contactos filtrados según los criterios seleccionados.
- **cargo**: Filtro para el cargo de los practitioners.
- **especialidad**: Filtro para la especialidad de los practitioners.
- **establecimiento**: Filtro para la ubicación de los practitioners.
- **searchQuery**: Filtro para la búsqueda por nombre.
- **locations**: Almacena la lista de establecimientos.
- **open**: Controla la apertura del modal para agregar o editar un contacto.
- **isEditing**: Indica si el modal está en modo de edición o creación de un nuevo contacto.
- **newContact**: Almacena los datos del contacto a agregar o editar.

##### Funciones

1. **fetchPractitioners**: Obtiene la lista de practitioners desde el servidor FHIR.
2. **fetchLocations**: Obtiene la lista de establecimientos desde el servidor FHIR.
3. **applyFilters**: Aplica los filtros seleccionados a la lista de practitioners.
4. **handleInputChange**: Actualiza el estado de los datos del contacto cuando se editan en el formulario.
5. **handleSubmit**: Envía los datos del formulario para agregar o editar un contacto en el servidor FHIR.
6. **handleEditClick**: Abre el modal para editar un contacto seleccionado.
7. **handleDeleteContact**: Elimina un contacto del servidor FHIR.

### Dependencias

El proyecto utiliza varias bibliotecas para la gestión de la interfaz y la comunicación con el servidor:

- **@mui/material**: Para la creación de la interfaz de usuario (botones, cuadros de texto, modales, etc.).
- **axios**: Para realizar solicitudes HTTP al servidor FHIR.

# Componente `EspecialidadesView`

El componente `EspecialidadesView` es una vista interactiva diseñada para mostrar servicios de salud organizados por especialidades y ubicaciones geográficas. Utiliza un mapa interactivo para visualizar la información de los servicios seleccionados por los usuarios.

## Descripción

Este componente permite a los usuarios explorar los servicios de salud basados en una especialidad médica seleccionada y su ubicación geográfica. Los usuarios pueden seleccionar una especialidad desde un menú desplegable, luego filtrar los servicios disponibles por esa especialidad y visualizar la ubicación exacta de los servicios en un mapa interactivo.

## Funcionalidades

### 1. **Selección de Especialidad**
   - Al cargarse el componente, se hace una solicitud para obtener una lista de especialidades médicas disponibles desde la API de FHIR.
   - Las especialidades se presentan en un menú desplegable para que el usuario seleccione una.

### 2. **Filtrado de Servicios por Especialidad**
   - Después de seleccionar una especialidad, el componente filtra los servicios disponibles que correspondan a esa especialidad.
   - Se obtienen las ubicaciones asociadas a los servicios seleccionados para mostrar en el siguiente paso.

### 3. **Selección de Ubicación**
   - Tras elegir una especialidad, los usuarios pueden seleccionar una ubicación específica relacionada con el servicio de salud correspondiente.
   - Las ubicaciones se presentan en otro menú desplegable que se actualiza dinámicamente según la especialidad seleccionada.

### 4. **Visualización en el Mapa**
   - Una vez que el usuario selecciona una ubicación, se muestra un mapa interactivo utilizando **Leaflet**.
   - El mapa marca la ubicación seleccionada con un marcador, mostrando detalles como el nombre de la ubicación en un **popup**.

### 5. **Interactividad del Mapa**
   - El mapa es completamente interactivo, permitiendo al usuario hacer zoom, mover el mapa y obtener más detalles de las ubicaciones seleccionadas.
   - Se obtiene la latitud y longitud de la ubicación seleccionada para mostrarla correctamente en el mapa.

## Estructura del Componente

- **Estados**: 
   - `especialidades`: Lista de especialidades obtenidas de la API.
   - `selectedEspecialidad`: Especialidad seleccionada por el usuario.
   - `ubicaciones`: Ubicaciones correspondientes a la especialidad seleccionada.
   - `selectedUbicacion`: Ubicación seleccionada para visualizar en el mapa.
  
- **Dependencias**:
   - **Leaflet**: Para mostrar el mapa interactivo.
   - **React**: Para la creación del componente y manejo de estados.


## Tecnologías Usadas

- **React**: Para el manejo de la interfaz de usuario.
- **Leaflet**: Para la visualización interactiva del mapa.


# Componente `ProtocoloView`

Vista que permite la selección de especialidades médicas y patologías, mostrando los detalles de la patología seleccionada y las ubicaciones de los servicios de salud relacionados en un mapa interactivo.

## Descripción

Esta vista permite a los usuarios:
- **Seleccionar una especialidad médica**, lo que actualiza la lista de patologías asociadas a esa especialidad.
- **Elegir una patología**, y ver información adicional sobre la misma, como observaciones, criterios de diagnóstico y exámenes relacionados.
- **Visualizar ubicaciones** de servicios de salud asociados a la especialidad y patología seleccionadas en un mapa interactivo.

El mapa utiliza **Leaflet** para mostrar los marcadores de ubicación 

## Funcionalidad

1. **Selección de Especialidad**:
   - El usuario puede elegir entre una lista de especialidades médicas obtenidas de la API de `HealthcareService`.
   
2. **Selección de Patología**:
   - Basado en la especialidad seleccionada, se cargan las patologías asociadas.
   - El usuario puede seleccionar una patología para ver detalles adicionales.

3. **Detalles de la Patología**:
   - Se muestran observaciones, criterios de diagnóstico y exámenes asociados con la patología seleccionada.

4. **Ubicaciones**:
   - Después de seleccionar una patología, se muestran las ubicaciones de servicios de salud disponibles en un mapa interactivo.

## Requisitos

- **React** para la construcción de la interfaz de usuario.
- **Material-UI** para los componentes de la interfaz (como `TextField`, `Select`, `Card`, etc.).
- **React-Leaflet** y **Leaflet** para el manejo del mapa interactivo.


## Componentes Principales

- **Especialidad y Patología**: Componentes `Select` y `TextField` que permiten al usuario seleccionar una especialidad y patología.
- **Detalles de Patología**: Se muestran observaciones, criterios y exámenes asociados a la patología seleccionada en una tarjeta.
- **Mapa**: Utiliza `MapContainer`, `TileLayer` y `Marker` de React-Leaflet para mostrar las ubicaciones asociadas en un mapa interactivo.


# Recurso `Estructura de los datos`


## HealthcareService

### Estructura del Recurso `HealthcareService`

El recurso `HealthcareService` describe los servicios ofrecidos por una organización de atención médica. A continuación se muestra un ejemplo de un recurso `HealthcareService` y una descripción de cada uno de sus campos.

### Ejemplo de un Recurso `HealthcareService`

```json
{
    "resourceType": "HealthcareService",
    "id": "1981",
    "meta": {
        "versionId": "1",
        "lastUpdated": "2024-10-22T17:28:35.156+00:00",
        "source": "#c8qaJmady9EulF85"
    },
    "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n\t\t\tOrtopedia\n\t\t</div>"
    },
    "identifier": [
        {
            "value": "10005"
        },
        {
            "value": "07-005"
        }
    ],
    "active": true,
    "providedBy": {
        "reference": "Organization/972",
        "display": "Clínica Ortopédica Araucanía"
    },
    "category": [
        {
            "coding": [
                {
                    "code": "27",
                    "display": "Specialist Medical"
                }
            ],
            "text": "Médico Especialista"
        }
    ],
    "type": [
        {
            "coding": [
                {
                    "code": "C009",
                    "display": "Ortopedia"
                }
            ]
        }
    ],
    "specialty": [
        {
            "coding": [
                {
                    "code": "C010",
                    "display": "Ortopedia General"
                }
            ]
        }
    ],
    "coverageArea": [
        {
            "reference": "Location/1817"
        },
        {
            "reference": "Location/1820"
        },
        {
            "reference": "Location/1810"
        }
    ],
    "appointmentRequired": true
}```

# Nota: esta es la estructura que se uso de forma local, es muy similar a la usada por el servicio de salud no hay cambios grandes que destacar.

### Ejemplo de un Recurso `Practitioner`

##Practitioner

### Estructura del Recurso `Practitioner`

El recurso `Practitioner` a un profesional de la salud, como un médico, enfermero, o cualquier otro trabajador relacionado con la atención médica.

```json
{
    "resourceType": "Practitioner",
    "id": "168",
    "meta": {
        "versionId": "1",
        "lastUpdated": "2024-11-07T05:19:45.311+00:00",
        "source": "#Mwz93uUHLko5vBio"
    },
    "identifier": [
        {
            "use": "official"
        }
    ],
    "active": true,
    "name": [
        {
            "family": "apellido_usuario",
            "given": [
                "Nombre_usuario"
            ]
        }
    ],
    "telecom": [
        {
            "system": "phone",
            "value": "99999999"
        },
        {
            "system": "email",
            "value": "ejemplo@ejemplo.com"
        }
    ],
    "address": [
        {
            "city": "DIRECCION S.S.A.S."
        }
    ],
    "gender": "other",
    "qualification": [
        {
            "code": {
                "text": "Contralor"
            },
            "issuer": {
                "reference": "Organization/1"
            }
        }
    ]
}```

# Nota: como se puede ver algunos campos fueron cambiados como por ejemplo qualification se uso para darle el cargo que tiene el profesional en este caso son 3 opciones medico, contralo y priorizador.

### Ejemplo de un Recurso `Location`

##Location

### Estructura del Recurso `Location`
El recurso `Location`representa una ubicación o dirección asociada a un servicio o establecimiento.

```json
{
    "resourceType": "Location",
    "id": "1801",
    "meta": {
        "versionId": "1",
        "lastUpdated": "2024-10-22T15:57:55.014+00:00",
        "source": "#QN1ELftpnM8QS5oD"
    },
    "text": {
        "status": "generated"
    },
    "extension": [
        {
            "url": "http://hl7.org/fhir/StructureDefinition/geolocation",
            "extension": [
                {
                    "url": "latitude",
                    "valueDecimal": -33.45678
                },
                {
                    "url": "longitude",
                    "valueDecimal": -70.12345
                }
            ]
        }
    ],
    "identifier": [
        {
            "system": "http://ssasur.cl/establecimientos-ids",
            "value": "121010"
        }
    ],
    "status": "active",
    "name": "DIRECCION S.S.A.S."
}```

# Nota: aca el recurso es muy basico lo unico que se agrego fue el extend de geolocalizacion para agregar los parametros de latitud y longitud para poder ubicar los establecimientos en el mapa interactivo.

### Dependencias:
- `@emotion/react`: `^11.11.4`
- `@emotion/styled`: `^11.11.5`
- `@mui/icons-material`: `^5.16.4`
- `@mui/material`: `^5.16.0`
- `@react-google-maps/api`: `^2.19.3`
- `axios`: `^1.7.2`
- `leaflet`: `^1.9.4`
- `react`: `^18.3.1`
- `react-dom`: `^18.3.1`
- `react-leaflet`: `^4.2.1`
- `react-router-dom`: `^6.24.1`
- `ssas-front`: `file:`

### Dependencias de Desarrollo:
- `@types/react`: `^18.3.3`
- `@types/react-dom`: `^18.3.0`
- `@vitejs/plugin-react`: `^4.3.1`
- `@vitejs/plugin-react-swc`: `^3.5.0`
- `eslint`: `^8.57.0`
- `eslint-plugin-react`: `^7.34.2`
- `eslint-plugin-react-hooks`: `^4.6.2`
- `eslint-plugin-react-refresh`: `^0.4.7`
- `vite`: `^5.3.3`


### Pasos de instalación:
```bash
git clone <repositorio>
cd <directorio del proyecto>
npm install
npm run dev





