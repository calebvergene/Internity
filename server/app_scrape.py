from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def extract_jobs(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')

    # Find both left and right panes that hold all job roles and details
    job_roles = soup.find_all('div', class_="dataRow leftPane rowExpansionEnabled rowSelectionEnabled")
    job_rows = soup.find_all('div', class_="dataRightPaneInnerContent paneInnerContent")

    jobs_list = []

    # Loop through all job roles and corresponding job rows
    for role, job in zip(job_roles, job_rows):
        # Extract the job information (link, location, name)
        job2 = job.find_all('div', class_='dataRow rightPane rowExpansionEnabled rowSelectionEnabled')
        for square in job2:
            # Retrieves links
            links = square.find('a', class_="link-quiet pointer flex-inline items-center justify-center z1 strong text-decoration-none rounded print-color-exact background-transparent darken2-hover text-blue border-box border-thick border-transparent border-darken2-focus px1")
            href_value = links['href'] if links else None
            
            job3 = square.find_all('div', class_="flex-auto line-height-4")
            lst = []
            for x in job3:
                job4 = x.find('div', class_="truncate")
                lst.append(job4.get_text(strip=True))
            
            # Create job info dictionary
            if len(lst) >= 2:
                job_info = {
                    'link': href_value,
                    'location': lst[1],
                    'name': lst[2]
                }
                jobs_list.append(job_info)
    
    return jobs_list

def main():
    # Initialize Selenium WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    # Navigate to the Airtable page
    url = "https://airtable.com/app17F0kkWQZhC6HB/shrOTtndhc6HSgnYb/tblp8wxvfYam5sD04?viewControls=on"
    driver.get(url)

    # Allow the page to fully load
    time.sleep(6)  # Wait 6 seconds initially for content to load

    # Find the first row to click on
    first_row = driver.find_element(By.CLASS_NAME, 'dataRow')  # Replace with the correct selector
    first_row.click()  # Click the row to focus on it

    all_jobs = []

    # Simulate arrow key navigation and extract content after each scroll
    actions = ActionChains(driver)

    for _ in range(50):  # Adjust the range as needed to ensure all rows are processed
        # Extract the page's HTML content
        page_source = driver.page_source
        jobs = extract_jobs(page_source)

        # Add the extracted jobs to the list
        all_jobs.extend(jobs)

        # Move down to the next row
        actions.send_keys(Keys.ARROW_DOWN).perform()
        time.sleep(0.05)  # Adjust the time if needed

    # Close the browser
    driver.quit()

    # Optional: Remove duplicates if any
    all_jobs = [dict(t) for t in {frozenset(job.items()) for job in all_jobs}]

    # Print or process the extracted jobs
    for job in all_jobs:
        print(job)

if __name__ == "__main__":
    main()
