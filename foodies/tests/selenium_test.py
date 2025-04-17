from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize the WebDriver
with webdriver.Chrome() as driver:
    # Open the login page
    driver.get("http://localhost:5174/login")
    
    # Customer login
    email_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "floatingInput"))
    )
    password_field = driver.find_element(By.ID, "floatingPassword")
    email_field.send_keys("jayshah@gmail.com")
    password_field.send_keys("password")
    submit_button = driver.find_element(By.CSS_SELECTOR, ".btn-login[type='submit']")
    submit_button.click()
    
    # Verify login success
    print("Page title after login:", driver.title)
    assert "Foodies - Online Food Delivery App" in driver.title  # Use the actual title
    
    # Print success message
    print("Test Passed: Customer login successful.")
    
    # Browse food
    food_menu = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "food-menu"))
    )
    food_menu.click()
    
    # Place order
    order_button = driver.find_element(By.ID, "order-button")
    order_button.click()
    
    # Verify order success
    success_message = driver.find_element(By.ID, "success-message")
    assert "Order placed successfully" in success_message.text
    
    # Print success message
    print("Test Passed: Customer login, browse, and order placement successful.")
    
    # Print page source for debugging
    print(driver.page_source)

    # Switch to frame if needed
    driver.switch_to.frame("frame_name_or_id")

    # Open the contact page
    driver.get("http://localhost:5174/contact")
    
    # Fill out the contact form
    name_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "first_name"))
    )
    phone_field = driver.find_element(By.CSS_SELECTOR, "input[type='tel']")
    email_field = driver.find_element(By.NAME, "email")
    description_field = driver.find_element(By.NAME, "message")
    
    name_field.send_keys("prawin")
    phone_field.send_keys("7904797658")
    email_field.send_keys("prawinkrk2003@gmail.com")
    description_field.send_keys("selenium test")
    
    # Submit the form
    submit_button = driver.find_element(By.CSS_SELECTOR, ".btn-primary")
    submit_button.click()
    
    # Verify submission success
    success_message = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "success-message"))
    )
    assert "Thank you for contacting us" in success_message.text
    
    # Print success message
    print("Test Passed: Contact form submitted successfully.") 