from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Initialize the WebDriver
with webdriver.Chrome() as driver:
    # Open the contact page
    driver.get("http://localhost:5174/contact")

    # Wait until the form is present
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "first_name"))
    )

    # Fill out the form
    name_field = driver.find_element(By.NAME, "first_name")
    phone_field = driver.find_element(By.CSS_SELECTOR, "input[type='tel']")
    email_field = driver.find_element(By.NAME, "email")
    message_field = driver.find_element(By.NAME, "message")

    name_field.send_keys("Prawin")
    phone_field.send_keys("7904797658")
    email_field.send_keys("prawinkrk2003@gmail.com")
    message_field.send_keys("This is an automated Selenium test.")

    # Submit the form
    submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    submit_button.click()

    # Wait for 3 seconds to let the submission happen (or wait for redirection if applicable)
    time.sleep(3)

    # You can print the new page source to debug response or thank you message
    print("Form submitted successfully.")
