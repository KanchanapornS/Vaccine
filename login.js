class IDCardValidator {
    static preventNonNumeric(event) {
        const key = event.key;
        if (!/^\d$/.test(key) && key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight") {
            event.preventDefault();
        }
    }

    static maskIdCardInput() {
        const idCardInput = document.getElementById("idCardInput");
        const inputValue = idCardInput.value;

        // Show ID card number as 'x' while typing
        if (inputValue.length > 0) {
            idCardInput.value = 'x'.repeat(inputValue.length);
        }
    }

    static validate() {
    const idCardInput = document.getElementById("idCardInput").value;
    const fullName = document.getElementById("fullName").value;
    const gender = document.getElementById("gender").value;
    const birthDate = new Date(document.getElementById("datePicker").value);
    const popupMessage = document.getElementById("popupMessage");
    const popup = document.getElementById("confirmationPopup");

    // Validate input fields
    let errorMessage = '';
    if (!fullName) errorMessage += "กรุณาระบุ ชื่อ-นามสกุล<br>";
    if (idCardInput.length !== 13 || !/^\d+$/.test(idCardInput)) {
        errorMessage += "กรุณาระบุเลขบัตรประชาชน 13 หลัก ที่เป็นตัวเลขเท่านั้น<br>";
    }
    if (!gender) errorMessage += "กรุณาระบุเพศ<br>";
    if (!birthDate || isNaN(birthDate)) errorMessage += "กรุณาระบุวันเกิด<br>";

    if (errorMessage) {
        popupMessage.innerHTML = `<strong style='color: red;'>ไม่สำเร็จ</strong><br>${errorMessage}`;
        popup.style.display = "block"; 
    } else {
        // Show asterisks for ID card number in the format *-****-*****-**-*
        const maskedIdCard = `*-****-*****-${idCardInput.slice(11, 13)}-*`;  // Hide ID card number
        popupMessage.innerHTML = `
            <strong style='color: green;'>สำเร็จ</strong><br>
            ชื่อ: ${fullName}<br>
            เลขบัตรประชาชน: ${maskedIdCard}<br>
            เพศ: ${gender}<br>
            วันเกิด: ${birthDate.toLocaleDateString('th-TH')}`;
        popup.style.display = "block";
    }
}

    static closePopup() {
        document.getElementById("confirmationPopup").style.display = "none";
    }

    static displayResult() {
        const fullName = document.getElementById("fullName").value;
        const idCardInput = document.getElementById("idCardInput").value;
        const gender = document.getElementById("gender").value;
        const birthDate = new Date(document.getElementById("datePicker").value);

        // Calculate age
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Determine eligibility
        let statusMessage = '';
        let isEligible = false;

        if (age >= 65 || (age < 2 && age >= 0)) {
            isEligible = true;
        }

        // Show result message
        statusMessage = isEligible ? "สามารถเข้ารับบริการได้" : "ไม่สามารถเข้ารับบริการได้";
        
        const resultMessage = `
            ชื่อ: ${fullName}<br>
            เลขบัตรประชาชน: ${idCardInput.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5")}<br>
            เพศ: ${gender === 'male' ? 'ชาย' : 'หญิง'}<br>
            อายุ: ${age} ปี<br>
            สถานะ: <span style="color: ${isEligible ? 'green' : 'red'};">${statusMessage}</span>
        `;

        document.getElementById("resultMessage").innerHTML = resultMessage;
        document.getElementById("resultPopup").style.display = "block"; // Show second popup
        this.closePopup(); // Hide first popup
    }

    static closeResultPopup() {
        document.getElementById("resultPopup").style.display = "none";
    }

    static clearForm() {
        document.getElementById("vaccineForm").reset();
        document.getElementById("resultScreen").style.display = "none";
    }

    static initializeBackButton() {
        document.getElementById("backBtn").addEventListener("click", () => {
            this.clearForm();
            document.getElementById("resultScreen").style.display = "none"; // Hide result screen
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Set the current date to the datePicker
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Convert date to YYYY-MM-DD format
    document.getElementById("datePicker").setAttribute("max", formattedDate);

    IDCardValidator.initializeBackButton();
});
