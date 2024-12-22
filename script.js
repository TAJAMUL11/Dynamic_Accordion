document.addEventListener("DOMContentLoaded", function () {
  const accordionContainer = document.querySelector(".accordion-container");
  const addAccordionButton = document.getElementById("addAccordionButton");
  const modal = document.getElementById("addAccordionModal");
  const closeModal = document.querySelector(".close-modal");
  const addAccordionForm = document.getElementById("addAccordionForm");
  const noAccordionMessage = document.getElementById("noAccordionMessage");

  checkNoAccordionMessage();

  addAccordionButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  addAccordionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("accordionTitle").value;
    const content = document.getElementById("accordionContent").value;
    addAccordionSection(title, content);
    modal.style.display = "none";
    addAccordionForm.reset();
    checkNoAccordionMessage();
  });

  function addAccordionSection(titleText, contentText) {
    const newSection = document.createElement("div");
    newSection.classList.add("accordion");

    const newHeader = document.createElement("div");
    newHeader.classList.add("accordion-header");
    newHeader.textContent = titleText;

    const newBody = document.createElement("div");
    newBody.classList.add("accordion-body");
    newBody.textContent = contentText;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-accordion");
    removeButton.addEventListener("click", function () {
      newSection.remove();
      checkNoAccordionMessage();
    });

    newSection.appendChild(newHeader);
    newSection.appendChild(newBody);
    newSection.appendChild(removeButton);
    accordionContainer.appendChild(newSection);

    newHeader.addEventListener("click", function (event) {
      const ctrlPressed = event.ctrlKey;
      if (!ctrlPressed) {
        document.querySelectorAll(".accordion-body").forEach((body) => {
          if (body !== newBody) {
            body.style.display = "none";
            body.previousElementSibling.classList.remove("active");
          }
        });
      }
      this.classList.toggle("active");
      newBody.style.display =
        newBody.style.display === "block" ? "none" : "block";
    });
  }

  document.querySelectorAll(".remove-accordion").forEach((button) => {
    button.addEventListener("click", function () {
      button.parentElement.remove();
      checkNoAccordionMessage();
      saveState();
    });
  });

  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", function (event) {
      const ctrlPressed = event.ctrlKey;
      if (!ctrlPressed) {
        document.querySelectorAll(".accordion-body").forEach((body) => {
          if (body !== this.nextElementSibling) {
            body.style.display = "none";
            body.previousElementSibling.classList.remove("active");
          }
        });
      }
      this.classList.toggle("active");
      this.nextElementSibling.style.display =
        this.nextElementSibling.style.display === "block" ? "none" : "block";
      saveState();
    });
  });

  // localStorage
  function saveState() {
    const accordions = [];
    document.querySelectorAll(".accordion").forEach((section, index) => {
      const isOpen =
        section.querySelector(".accordion-body").style.display === "block";
      accordions.push(isOpen);
    });
    localStorage.setItem("accordionState", JSON.stringify(accordions));
  }

  function restoreState() {
    const accordionState =
      JSON.parse(localStorage.getItem("accordionState")) || [];
    const accordions = document.querySelectorAll(".accordion");
    accordionState.forEach((isOpen, index) => {
      if (isOpen) {
        accordions[index]
          .querySelector(".accordion-header")
          .classList.add("active");
        accordions[index].querySelector(".accordion-body").style.display =
          "block";
      }
    });
    checkNoAccordionMessage();
  }

  function checkNoAccordionMessage() {
    if (document.querySelectorAll(".accordion").length === 0) {
      noAccordionMessage.style.display = "block";
    } else {
      noAccordionMessage.style.display = "none";
    }
  }

  restoreState();
});
