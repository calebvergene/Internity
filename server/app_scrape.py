from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def extract_job(page_source):
    soup = BeautifulSoup(page_source, 'html.parser')
    job_data = []

    # Find the container column that holds all job roles
    job_roles = soup.find_all('div', class_="dataRow leftPane rowExpansionEnabled rowSelectionEnabled")
    
    job_roles_list = []
    for job_role in job_roles:
        # Extract the nested divs containing job role descriptions
        job_role2 = job_role.find('div', class_='cell primary read')
        if job_role2:
            job_role3 = job_role2.find('div', class_='flex-auto line-height-4')
            if job_role3:
                job_role4 = job_role3.find('div', class_='truncate')
                if job_role4:
                    job_roles_list.append(job_role4.get_text(strip=True))


    # This container has all of the right side rows, containing job info
    job_rows = soup.find_all('div', class_="dataRightPaneInnerContent paneInnerContent")
    
    job_links_list = []
    for job in job_rows:
        job2 = job.find_all('div', class_='dataRow rightPane rowExpansionEnabled rowSelectionEnabled')
        for square in job2:
            # Retrieves links
            links = square.find('a', class_="link-quiet pointer flex-inline items-center justify-center z1 strong text-decoration-none rounded print-color-exact background-transparent darken2-hover text-blue border-box border-thick border-transparent border-darken2-focus px1")
            href_value = links['href']
            job_links_list.append(href_value)
            
            job3 = square.find_all('div', class_="flex-auto line-height-4")
            lst = []
            for x in job3:
                job4 = x.find('div', class_="truncate")
                lst.append(job4.get_text(strip=True))
            lst[0] = href_value
            job_info = {'link': lst[0],'location': lst[1],'name': lst[2]}
            job_links_list.append(job_info)
    print(lst)

                
        

def main():
    # Initialize Selenium WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    # Navigate to the Airtable page
    url = "https://airtable.com/app17F0kkWQZhC6HB/shrOTtndhc6HSgnYb/tblp8wxvfYam5sD04?viewControls=on"
    driver.get(url)

    # Allow the page to fully load
    time.sleep(6)  # Wait 10 seconds initially for content to load

    # Find the first row to click on
    first_row = driver.find_element(By.CLASS_NAME, 'dataRow')  # Replace with the correct selector
    first_row.click()  # Click the row to focus on it

    # Initialize an empty list to store all job roles
    all_job_roles = []

    # Simulate arrow key navigation and extract content after each scroll
    actions = ActionChains(driver)

    for _ in range(50):  # Adjust the range as needed to ensure all rows are processed
        # Extract the page's HTML content
        page_source = driver.page_source
        job_roles_text = extract_job(page_source)

        # Add the extracted job roles to the list
        # all_job_roles.extend(job_roles_text)

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
