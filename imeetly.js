console.log("Appointment modal script loaded");
// Font Awesome CDN
const fontAwesomeCDN = document.createElement('link');
fontAwesomeCDN.rel = 'stylesheet';
fontAwesomeCDN.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
document.head.appendChild(fontAwesomeCDN);
document.addEventListener('DOMContentLoaded', initializeAppointmentModal);

console.log("Appointment modal script loaded");

document.addEventListener('DOMContentLoaded', initializeAppointmentModal);

function initializeAppointmentModal() {
  const shadowRoot = createShadowModal();
  setupModalFunctionality(shadowRoot);
  loadTimeslots(shadowRoot)
  addDefaultValues(shadowRoot);
}

function createShadowModal() {
  const shadowHost = document.createElement('div');
  shadowHost.id = 'appointment-shadow-host';
  document.body.appendChild(shadowHost);

  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  const modal = document.createElement('div');
  modal.innerHTML = `
    <div id="appointmentModal">
      <div class="appModal" >
      <span class="appModalDelete"><i class="fas fa-times"></i></span>
        <div class="appHeader">
          <h2 class="title"></h2>
        </div>
      <form class="appt-form" id="appt-form">
             <div class="appt-form-row">
            <div class="appt-form-group">
              <input type="text" id="firstName" name="firstName" required="">
              <label for="firstName">First Name</label>
            </div>
            <div class="appt-form-group">
              <input type="text" id="lastName" name="lastName" required="">
              <label for="lastName">Last Name</label>
          </div>
          </div>
             <div class="appt-form-row">
            <div class="appt-form-group">
              <input type="email" id="email" name="email" required>
              <label for="email">Email</label>
            </div>
            <div class="appt-form-group">
              <input type="tel" id="phone" name="phone" required>
              <label for="phone">Phone</label>
            </div>
          </div>
            <input id="timeSelected" type="hidden">
            <div class="input-container">
              <input id="date" class="appInput" placeholder="Date" type="date">
            </div>
         
          <p id='timeSlotsError'></p>
          <p id='loadingMessage'></p>
          <div id="appointmentSlotsContainer"></div>
          <div class="appButtonContainer">
            <button id="appSubmit" type="submit" class="appt-submit">Book Appointment <i class="fas fa-paper-plane"></i></button>
          </div>
        </form>
         </div>
      </div>  
    </div>`;

  shadowRoot.appendChild(modal);

  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;500;600&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
    
        .appt-form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .appt-form-group {
      flex: 1;
      position: relative;
    }

    .appt-form-group input {
      width: 90%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 15px;
      transition: all 0.2s ease;
      color:#6f6f6f;
    }

    .appt-form-group input:focus {
      outline: none;
      border-color: #1877f2;
      box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.2);
    }

    .appt-form-group label {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #65676b;
      transition: all 0.2s ease;
      pointer-events: none;
      font-size: 15px;
    }

    .appt-form-group input:focus + label,
    .appt-form-group input:not(:placeholder-shown) + label {
      top: 0;
      font-size: 12px;
      background: white;
      padding: 0 4px;
    }

    #appointmentModal {
display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    .appModal {
     background: white;
    padding: 24px;
    width: 90%;
    max-width: 500px;
    border-radius: 12px;
    position: relative;
    animation: slideIn 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    
    
    .appt-form-group {
    flex: 1;
    position: relative;
}
    .appHeader {

    }

    .title {
         color: #1877f2;
        margin-top: 0px;
    font-size: 24px;
    text-align: center;
    margin-bottom: 30px;
    }

    .appModalDelete {
      font-size: 20px;
      color: white;
      cursor: pointer;
      position: absolute;
      right: 15px;
      top: 25px;
      transform: translateY(-50%);
      opacity: 0.8;
      transition: opacity 0.2s;
      padding: 0px 0px 7px 7px;
    border-radius: 90px 90px;
    height: 20px;
    width: 20px;
}
    }

    .appModalDelete:hover {
      opacity: 1;
    }

    #appointmentForm {
      padding: 20px;
    }

    .input-container {
      margin-bottom: 12px;
      flex: 1 1 calc(50% - 5px);
      min-width: 200px;
    }

    .appInput {
      width: 93.4%;
      padding: 14px 16px;
      border: 1px solid #dddfe2;
      border-radius: 6px;
      font-size: 15px;
      color: #6f6f6f;
      transition: border-color 0.2s;

    }

    .appInput:focus {
      outline: none;
      border-color: #1877f2;
      box-shadow: 0 0 0 2px rgba(24, 119, 242, 0.2);
    }

    .appInput::placeholder {
      color: #8a8d91;
    }

    #appointmentSlotsContainer {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 24px;
    }

    #appointmentSlotsContainer button {
      flex: 1 1 calc(33.333% - 10px);
      min-width: 100px;
      padding: 10px;
      border: 1px solid #dddfe2;
      border-radius: 6px;
      background-color: #fff;
      color: #1c1e21;
      cursor: pointer;
      transition: all 0.2s;
    }

        .appTime {
     padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    }

    #appointmentSlotsContainer button:hover {
      background-color: #f5f6f7;
    }

    #appointmentSlotsContainer .selected {
      background-color: #1877f2;
      color: white;
      border-color: #1877f2;
    }

    .appButtonContainer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
      padding-top: 20px;
    }

    .appButton {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .appt-submit {
    width: 100%;
    padding: 12px;
    background: #1877f2;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex
;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

    .appCancel:hover {
      background-color: #d8dadf;
    }

    .appSubmit {
      background-color: #1877f2;
      border: none;
      color: white;
    }

    .appSubmit:hover {
      background-color: #166fe5;
    }

    .error {
      border-color: #ff4d4f;
    }

    .error-message {
      color: #ff4d4f;
      font-size: 13px;
      margin-top: 4px;
    }

    #timeSlotsError {
      color: #ff4d4f;
      font-size: 14px;
      margin: 10px 0;
    }
      .success-content {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: scaleIn 0.5s ease;
}

.success-title {
  color: #1c1e21;
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.success-message {
  color: #65676b;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.success-details {
  color: #8a8d91;
  font-size: 14px;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
  `;
  shadowRoot.appendChild(styleElement);

  return shadowRoot;
}

function setupModalFunctionality(shadowRoot) {
  const modal = shadowRoot.getElementById('appointmentModal');
  const modalTitle = shadowRoot.querySelector('.appHeader .title');
  modalTitle.textContent = "Book Your Appointment";

  setupModalOpenClose(shadowRoot, modal);
  setupDateAndTimeSlots(shadowRoot);
  setupFormSubmission(shadowRoot);

  const domainId = getKeyParam();
  fetchConfigurations(domainId)
    .then(applyConfigurations(shadowRoot, modal))
    .catch(error => console.error('Error applying configurations:', error));
}

function setupModalOpenClose(shadowRoot, modal) {
  shadowRoot.querySelector('.appModalDelete').onclick = () => modal.style.display = "none";
  window.closeModal = () => modal.style.display = 'none';
}

function setupDateAndTimeSlots(shadowRoot) {
  const dateInput = shadowRoot.getElementById('date');
  dateInput.value = new Date().toISOString().split('T')[0];
  dateInput.addEventListener('change', () => loadTimeslots(shadowRoot));
}

function setupFormSubmission(shadowRoot) {
  const form = shadowRoot.querySelector('.appt-form');
  const submitButton = shadowRoot.getElementById('appSubmit');

  form.onsubmit = async (e) => {
    e.preventDefault();
    
    if (!checkInputs(shadowRoot)) {
      return;
    }

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    const formData = getFormData(shadowRoot);
    
    try {
      const response = await sendRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PUBLIC_APPOINTMENT}`, formData, 'POST');
      console.log('Appointment booked:', response);
      showSuccessMessage(shadowRoot);
      form.reset();
    } catch (error) {
      console.error('Error booking appointment:', error);
      showErrorMessage(shadowRoot, 'Failed to book appointment. Please try again.');
    } finally {
      // Re-enable submit button and restore original text
      submitButton.disabled = false;
      submitButton.innerHTML = 'Book Appointment <i class="fas fa-paper-plane"></i>';
    }
  };
}

function checkInputs(shadowRoot) {
  let isValid = true;

  // Check first name
  const firstName = shadowRoot.getElementById('firstName');
  if (firstName.value.trim().length < 3) {
    showInputError(firstName, 'First name must be at least 3 characters long');
    isValid = false;
  } else {
    clearInputError(firstName);
  }

  // Check last name
  const lastName = shadowRoot.getElementById('lastName');
  if (lastName.value.trim().length < 3) {
    showInputError(lastName, 'Last name must be at least 3 characters long');
    isValid = false;
  } else {
    clearInputError(lastName);
  }

  // Check email
  const email = shadowRoot.getElementById('email');
  if (!isValidEmail(email.value)) {
    showInputError(email, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearInputError(email);
  }

  // Check phone number
  const phone = shadowRoot.getElementById('phone');
  if (!isValidPhoneNumber(phone.value)) {
    showInputError(phone, 'Please enter a valid phone number');
    isValid = false;
  } else {
    clearInputError(phone);
  }

  // Check if time slot is selected
  const timeSelected = shadowRoot.getElementById('timeSelected');
  if (!timeSelected.value) {
    showtimeSlotsErrorMessage(shadowRoot, 'Please select a time slot');
    isValid = false;
  } else {
    const element = shadowRoot.getElementById('timeSlotsError');
    element.textContent = '';
  }

  return isValid;
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPhoneNumber(phone) {
  // This is a simple validation for demonstration. You might want to use a more robust solution for production.
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
}

function showInputError(input, message) {
  const container = input.parentElement;
  const error = container.querySelector('.error-message') || document.createElement('div');
  error.className = 'error-message';
  error.textContent = message;
  if (!container.querySelector('.error-message')) {
    container.appendChild(error);
  }
  input.classList.add('input-error');
}

function clearInputError(input) {
  const container = input.parentElement;
  const error = container.querySelector('.error-message');
  if (error) {
    container.removeChild(error);
  }
  input.classList.remove('input-error');
}

function showErrorMessage(shadowRoot, message) {
  const container = shadowRoot.getElementById('appointmentSlotsContainer');
  const error = document.createElement('p');
  error.className = 'error-message';
  error.textContent = message;
  container.insertBefore(error, container.firstChild);
}
function showtimeSlotsErrorMessage(shadowRoot, message) {
  const element = shadowRoot.getElementById('timeSlotsError');
  element.textContent = message;
}

function showSuccessMessage(shadowRoot) {
  // Hide all inputs and buttons
  const form = shadowRoot.getElementById('appt-form');
  form.style.display = 'none';

  // Create a new container for the success message
  const successContainer = document.createElement('div');
  successContainer.className = 'success-container';
  successContainer.innerHTML = `
  <div class="success-content">
    <div class="success-icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <h3 class="success-title">Thank You!</h3>
    <p class="success-message">Your appointment has been successfully booked. We've sent you a confirmation email with all the details.</p>
    <p class="success-details">You can close this window now.</p>
  </div>
`;

  // Get the modal content container
  const modalContent = shadowRoot.querySelector('.appModal');

  // Append the success container to the modal content
  modalContent.appendChild(successContainer);

  // Add event listener to close button
  const closeBtn = successContainer.querySelector('#closeModalBtn');
  closeBtn.addEventListener('click', () => {
    const modal = shadowRoot.getElementById('appointmentModal');
    modal.style.display = 'none';
    // Optional: Reset the form here if needed
    resetForm(shadowRoot);
  });
}

function getFormData(shadowRoot) {
  return {
    firstName: shadowRoot.getElementById('firstName').value,
    lastName: shadowRoot.getElementById('lastName').value,
    email: shadowRoot.getElementById('email').value,
    phone: shadowRoot.getElementById('phone').value,
    date: shadowRoot.getElementById('timeSelected').value,
    timezone: getTimezoneOffset()
  };
}

function getTimezoneOffset() {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  return `${offset > 0 ? '-' : '+'}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}



function applyConfigurations(shadowRoot, modal) {
  return configs => {
    let colorOne, colorTwo;
    configs.data.configuration.forEach(config => {
      switch (config.fieldKey) {
        case 'POPUP_TITILE':
          shadowRoot.querySelector('.appHeader .title').textContent = config.fieldValue;
          break;
        case 'BUTTON_STYLE':
          const buttonConfig = JSON.parse(config.fieldValue);
          const newBtn = createStyledButton(buttonConfig, modal);
          shadowRoot.appendChild(newBtn);
          break;
        case 'POP_UP_COLOR_ONE':
          colorOne = config.fieldValue;
          break;
        case 'POP_UP_COLOR_TWO':
          colorTwo = config.fieldValue;
          break;
      }
    });

    if (colorOne && colorTwo) {
      applyColors(shadowRoot, colorOne, colorTwo);
    }
  };
}

function applyColors(shadowRoot, colorOne, colorTwo) {
  const style = document.createElement('style');
  style.textContent = `
    
    .appHeader .title {
      color: ${colorOne} !important;
    }


    .appTime.selected {
      background-color: ${colorOne} !important;
    }
    .input-container::before {
      color: ${colorOne} !important;
    }
    .info-p {
      color: ${colorOne} !important;
      text-align: center;
    }
    #closeModalBtn {
      background-color:  ${colorOne} !important;
      color: white;
    }
      #appSubmit{
        background: ${colorOne} !important;
      }
            .appModalDelete {
      color: white;
       background: ${colorOne} !important;
    }
       .success-icon {
    color:  ${colorOne} !important;
    }
  `;
  shadowRoot.appendChild(style);
}

function createStyledButton(config, modal) {
  const btn = document.createElement('button');
  btn.id = 'ButtonModalAppointment';
  btn.textContent = config.buttonText || "Book an appointment";

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '100',
    fontSize: '20px',
    padding: '9px 15px',
    fontWeight: 'normal',
    margin: '0px 5px',
    cursor: 'pointer',
    background: config.backgroundColor || '#337ab7',
    color: config.fontColor || 'white',
    border: 'none'
  });

  if (config) {
    if (config.fontFamily) btn.style.fontFamily = config.fontFamily;
    if (config.fontSize) btn.style.fontSize = `${config.fontSize}px`;
    if (config.fontWeight) btn.style.fontWeight = config.fontWeight;
    if (config.isUppercase) btn.style.textTransform = 'uppercase';
    if (config.borderRadius) btn.style.borderRadius = `${config.borderRadius}px`;
    if (config.horizontalPadding || config.verticalPadding) {
      btn.style.padding = `${config.verticalPadding || 9}px ${config.horizontalPadding || 15}px`;
    }
    if (config.customShadow) {
      btn.style.boxShadow = `${config.shadowHorizontal || 0}px ${config.shadowVertical || 0}px ${config.shadowBlur || 0}px ${config.shadowSpread || 0}px ${config.shadowColor || '#000000'}`;
    }
  }

  btn.onclick = () => modal.style.display = 'flex';
  return btn;
}

const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    PUBLIC_APPOINTMENT: '/api/public/appointment',
    PUBLIC_TIMESLOTS: '/api/public/timeslots',
    CONFIGURATION: '/api/configuration'
  }
};

function loadTimeslots(shadowRoot) {
  const date = shadowRoot.getElementById('date').value;
  const timezone = getTimezoneOffset();
  fetchAndCreateAppointmentSlots(shadowRoot, date, timezone);
}

function fetchAndCreateAppointmentSlots(shadowRoot, date, timezone) {
  const container = shadowRoot.getElementById('appointmentSlotsContainer');
  container.style.display='none';

  const loadingMessage = shadowRoot.getElementById('loadingMessage');
  loadingMessage.innerHTML = '<p class="info-p">checking availability...</p>';
  loadingMessage.style.display='block';

  const domainId = getKeyParam();
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PUBLIC_TIMESLOTS}?domainId=${domainId}&offset=${encodeURIComponent(timezone)}&date=${date}`;

  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(data => createAppointmentSlots(data.data?.slots, shadowRoot))
    .catch(error => console.error('Error fetching time slots:', error));
}

function createAppointmentSlots(slots, shadowRoot) {
  const container = shadowRoot.getElementById('appointmentSlotsContainer');
  container.innerHTML = '';
  container.style.display='grid';

  const loadingMessage = shadowRoot.getElementById('loadingMessage');
  loadingMessage.style.display='none';

  if (slots == undefined || slots.length === 0) {
    loadingMessage.style.display='block';
    loadingMessage.innerHTML = '<p class="info-p">No available time slots for the selected date.</p>';
    return;
  }

  slots.sort((a, b) => new Date(a) - new Date(b));

  slots.forEach(slot => {
    const timeDiv = document.createElement('div');
    timeDiv.className = 'appTime';
    timeDiv.textContent = formatTime(slot);
    timeDiv.addEventListener('click', () => selectTimeSlot(slot, timeDiv, shadowRoot));
    container.appendChild(timeDiv);
  });
}

function formatTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function selectTimeSlot(slot, timeDiv, shadowRoot) {
  shadowRoot.querySelectorAll('.appTime').forEach(t => t.classList.remove('selected'));
  shadowRoot.getElementById('timeSelected').value = slot;
  timeDiv.classList.add('selected');
}

function sendRequest(endpoint, payload, method) {
  return fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'domain_id': getKeyParam()
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    });
}

function getKeyParam() {
  const scripts = document.getElementsByTagName('script');
  for (let script of scripts) {
    if (script.src.includes('modal.js')) {
      return script.getAttribute('key');
    }
  }
  return null;
}

function fetchConfigurations(domainId) {
  return fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONFIGURATION}?domainId=${domainId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    });
}

function addDefaultValues(shadowRoot) {
  shadowRoot.getElementById('firstName').value = 'John';
  shadowRoot.getElementById('lastName').value = 'Doe';
  shadowRoot.getElementById('email').value = 'john.doe@example.com';
  shadowRoot.getElementById('phone').value = '+1234567890';

  // Set today's date as the default
  const today = new Date().toISOString().split('T')[0];
  shadowRoot.getElementById('date').value = today;

  // Note: We can't set a default for the time slot as it depends on the API response
}