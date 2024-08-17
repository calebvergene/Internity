from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def extract_job_roles_from_page_source(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')
    job_roles_text = []

    # Find the container div that holds all job rows
    job_roles = soup.find_all('div', class_="dataRow leftPane rowExpansionEnabled rowSelectionEnabled")

    for job_role in job_roles:
        # Extract the nested divs containing job role descriptions
        job_role2 = job_role.find('div', class_='cell primary read')
        if job_role2:
            job_role3 = job_role2.find('div', class_='flex-auto line-height-4')
            if job_role3:
                job_role4 = job_role3.find('div', class_='truncate')
                if job_role4:
                    job_roles_text.append(job_role4.get_text(strip=True))

    return job_roles_text

def main():
    # Initialize Selenium WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    # Navigate to the Airtable page
    url = "https://airtable.com/app17F0kkWQZhC6HB/shrOTtndhc6HSgnYb/tblp8wxvfYam5sD04?viewControls=on"
    driver.get(url)

    # Allow the page to fully load
    time.sleep(10)  # Wait 10 seconds initially for content to load

    # Find the first row to click on
    first_row = driver.find_element(By.CLASS_NAME, 'dataRow')  # Replace with the correct selector
    first_row.click()  # Click the row to focus on it

    # Initialize an empty list to store all job roles
    all_job_roles = []

    # Simulate arrow key navigation and extract content after each scroll
    actions = ActionChains(driver)

    for _ in range(444):  # Adjust the range as needed to ensure all rows are processed
        # Extract the page's HTML content
        page_source = driver.page_source
        job_roles_text = extract_job_roles_from_page_source(page_source)

        # Add the extracted job roles to the list
        all_job_roles.extend(job_roles_text)

        # Move down to the next row
        actions.send_keys(Keys.ARROW_DOWN).perform()
        time.sleep(0.05)  # Adjust the time if needed

    # Close the browser
    driver.quit()

    # Optional: Remove duplicates if any
    all_job_roles = list(set(all_job_roles))

    # Print or process the extracted job roles
    for job_role in all_job_roles:
        print(job_role)
    print(len(all_job_roles))

if __name__ == "__main__":
    main()
