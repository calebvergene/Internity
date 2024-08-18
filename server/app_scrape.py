from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import json
import requests
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

def extract_base_rows():
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
    return all_jobs    


def finish_extract():
    all_jobs = extract_base_rows()
    
    print("Extracting deeper info...")
    for job in all_jobs[0:5]:
        link = job['link']

        # Send a GET request to the job link
        response = requests.get(link)
        
        if response.status_code == 200:
            # Parse the page content with BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the job title
            job_title_element = soup.find('h1', class_="ant-typography index_job-title__sStdA css-10amgy5")
            job_title_text = job_title_element.get_text(strip=True) if job_title_element else "No title found"
            job['job_title'] = job_title_text

            # Find the real job link
            job_skills = []
            job_skill_elements = soup.find_all('div', class_="index_flex-row__nfFCY index_skill-matching-tags-area__S4SwB")
    
            for skill_container in job_skill_elements:
                # Extract each skill separately
                individual_skills = skill_container.find_all('span')  # Adjust the tag as needed based on the structure
                
                for skill in individual_skills:
                    job_skill_text = skill.get_text(strip=True) if skill else "No skill found"
                    job_skills.append(job_skill_text)
            job['skills'] = job_skills
            

        try:
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
            driver.get(link)
            # Wait until the "Apply Now" button is present in the DOM and visible
            apply_button = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, 'ant-btn-primary'))
            )
            # Click the "Apply Now" button
            apply_button.click()

            # Wait for the popup to appear and switch to it if necessary
            WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "ant-modal-content"))
            )

            # Make sure the "Continue Applying" button is visible
            continue_button = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, "//button[contains(@class, 'index_cancel-button__VEzeD')]"))
            )
            continue_button.click()

            # Wait for the new page to load after clicking the button
            time.sleep(5)
            driver.switch_to.window(driver.window_handles[-1])
            WebDriverWait(driver, 10).until(EC.url_changes(link))
            # Additional sleep to ensure the page is fully loaded
            
            # Extract the new URL after the click
            new_link = driver.current_url
            job['apply_link'] = new_link
        except Exception as e:
            print(f"Failed to retrieve apply link for {job['link']}. Error: {e}")
            job['apply_link'] = None
    
    
        print(job['apply_link'], job['job_title'], job['name'])

    with open('extracted_jobs.json', 'w') as file:
        json.dump(all_jobs, file, indent=4)

finish_extract()