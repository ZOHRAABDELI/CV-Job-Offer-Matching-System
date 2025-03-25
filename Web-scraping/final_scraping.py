import requests
from bs4 import BeautifulSoup
import json
import time
import re
import random  

def extract_profile_details(soup):
    """Extract profile details from the profile page soup object"""
    profile_data = {}

    # Extract profile ID
    profile_id_element = soup.find('h1', string=re.compile(r'Profil CV N°\d+'))
    if profile_id_element:
        profile_id = re.search(r'Profil CV N°(\d+)', profile_id_element.text)
        profile_data['profile_id'] = profile_id.group(1) if profile_id else "Unknown"


    # Types of jobs sought
    job_types_section = soup.find('h3', string='Types de métiers recherchés')
    job_types = []
    if job_types_section:
        ul = job_types_section.find_next('ul', class_='list')
        if ul:
            job_types = [li.get_text(strip=True) for li in ul.find_all('li')]
    profile_data['job_types'] = job_types

    # Experience sectors
    experience_sectors_section = soup.find('h4', string='Expérience dans les secteurs d´activité suivants :')
    sectors = []
    if experience_sectors_section:
        ul = experience_sectors_section.find_next('ul', class_='list')
        if ul:
            sectors = [li.get_text(strip=True) for li in ul.find_all('li')]
    profile_data['experience_sectors'] = sectors

    # Professional experience
    professional_experience_section = soup.find('h4', string='Expérience professionnelle')
    experience = []
    if professional_experience_section:
        uls = professional_experience_section.find_all_next('ul')
        for ul in uls:
            title = ul.find('li', class_='title')
            establishment = ul.find('li', class_='establishment')
            period = ul.find('li', class_='period')
            description = ul.find('li', class_='description')
            if title:
                experience.append({
                    'title': title.get_text(strip=True),
                    'establishment': establishment.get_text(strip=True) if establishment else '',
                    'period': period.get_text(strip=True) if period else '',
                    'description': description.get_text(strip=True) if description else ''
                })
    profile_data['experience_professionnelle'] = experience

    # Skills (Compétences)
    competences = []
    competences_section = soup.find('h3', string='Compétences')
    if competences_section:
        # Look for the div that contains the field-items
        field_items_div = competences_section.find_next('div', class_='field-items')
        if field_items_div:
            # Get the field-item div which contains the actual text
            field_item_div = field_items_div.find('div', class_='field-item')
            if field_item_div:
                # Extract the text content
                competences_text = field_item_div.get_text(strip=True)
                # Process the text to extract individual competences
                if '•' in competences_text:
                    # Split by bullet points
                    parts = competences_text.split('•')
                    for part in parts:
                        if part.strip():
                            competences.append(part.strip())
                else:
                    # If no bullet points, add as a single item or split by newlines
                    lines = [line.strip() for line in competences_text.split('\n') if line.strip()]
                    competences.extend(lines)
    
    
    if not competences:
        competences_div = soup.find('div', class_='field-name-field-profil-candidat-competence')
        if competences_div:
            # Try to get all text content
            competences_text = competences_div.get_text(strip=True)
            if competences_text:
                # Split by bullet points or newlines
                if '•' in competences_text:
                    parts = competences_text.split('•')
                    for part in parts:
                        if part.strip():
                            competences.append(part.strip())
                else:
                    lines = [line.strip() for line in competences_text.split('\n') if line.strip()]
                    competences.extend(lines)
                    
    profile_data['competences'] = competences

    # Formation (Education)
    formation = {}
    niveau_section = soup.find('strong', string=re.compile("Niveau d'études :"))
    if niveau_section:
        span = niveau_section.find_next('span')
        if span:
            formation['level'] = span.get_text(strip=True)

    # Education details
    education_details = []
    education_items = soup.find_all('div', class_='resume-subsection default-format')
    for item in education_items:
        title = item.find('h4')
        establishment = item.find('li', class_='resume-establishment')
        period = item.find('li', class_='resume-period')
        description = item.find('li', class_='description')
        education_details.append({
            'title': title.get_text(strip=True) if title else '',
            'establishment': establishment.get_text(strip=True) if establishment else '',
            'period': period.get_text(strip=True) if period else '',
            'description': description.get_text(strip=True) if description else ''
        })
    formation['details'] = education_details
    profile_data['formation'] = formation

    # FIXED: Key skills 
    key_skills = []
    key_skills_section = soup.find('h3', string='Compétences clés')
    if key_skills_section:
        skills_ul = key_skills_section.find_next('ul', class_='skills')
        if skills_ul:
            for li in skills_ul.find_all('li'):
                key_skills.append(li.get_text(strip=True))
    profile_data['competences_cles'] = key_skills

    # Languages
    languages_section = soup.find('h3', string='Langues')
    languages = []
    if languages_section:
        ul = languages_section.find_next('ul', class_='language')
        if ul:
            for lang_item in ul.find_all('li'):
                sub_ul = lang_item.find('ul')
                if sub_ul:
                    lang_elements = sub_ul.find_all('li')
                    if len(lang_elements) >= 2:
                        languages.append({
                            'name': lang_elements[0].get_text(strip=True),
                            'level': lang_elements[1].get_text(strip=True)
                        })
    profile_data['languages'] = languages

    # FIXED: Additional information - Stop at "Dernière mise à jour"
    plus_info = {}
    plus_info_section = soup.find('h3', string="Plus d'informations")
    if plus_info_section:
        info_ul = plus_info_section.find_next('ul')
        if info_ul:
            for li in info_ul.find_all('li'):
                strong = li.find('strong')
                span = li.find('span')
                if strong and span:
                    label = strong.get_text(strip=True).rstrip(':').rstrip(' :').lower().replace(' ', '_')
                    value = span.get_text(strip=True)
                    plus_info[label] = value
                    # Stop at "Dernière mise à jour"
                    if label == 'dernière_mise_à_jour':
                        break
    profile_data['plus_info'] = plus_info

    # Debug print to check what we're extracting for competences
    print("Competences found:", profile_data['competences'])
    print("Competences clés found:", profile_data['competences_cles'])

    return profile_data

def scrape_profile(profile_id):
    """Scrape a single profile by ID"""
    cv_url = f"https://www.algeriejob.com/recrutement-algerie-cv/{profile_id}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.algeriejob.com/recherche-base-donnees-cv'
    }
    
    try:
        print(f"Scraping profile: {cv_url}")
        response = requests.get(cv_url, headers=headers, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        return extract_profile_details(soup)
    except Exception as e:
        print(f"Error scraping profile {profile_id}: {e}")
        return None

def get_profile_ids_from_search_page(soup):
    """Extract profile IDs from the search results page"""
    profile_ids = []
    profile_elements = soup.select('div.card-profile')
    for element in profile_elements:
        profile_id = element.get('data-nid')
        if profile_id:
            profile_ids.append(profile_id)
    return profile_ids

def scrape_search_results(base_url, pages=1, delay_range=(2, 5)):
    """Scrape profile IDs from search results and then scrape each profile"""
    all_profiles = []
    
    for page in range(1, pages + 1):
        try:
            print(f"Scraping search results page {page}")
            response = requests.get(
                base_url, 
                params={'page': page}, 
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
                }, 
                timeout=30
            )
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            profile_ids = get_profile_ids_from_search_page(soup)

            if not profile_ids:
                print(f"No profile IDs found on page {page}")
                continue

            for profile_id in profile_ids:
                profile_data = scrape_profile(profile_id)
                if profile_data:
                    all_profiles.append(profile_data)
                time.sleep(random.uniform(delay_range[0], delay_range[1]))
            
        except Exception as e:
            print(f"Error scraping page {page}: {e}")
        
    print(f"Scraped {len(all_profiles)} profiles")
    return all_profiles

def save_profiles(profiles, filename='1000_CVs.json'):
    """Save profiles to a JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(profiles, f, ensure_ascii=False, indent=4)
        print(f"Saved {len(profiles)} profiles to {filename}")
    except Exception as e:
        print(f"Error saving profiles: {e}")

# For direct testing with HTML content
def test_with_html_file(html_file):
    """Test parsing with a local HTML file"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        soup = BeautifulSoup(html_content, 'html.parser')
        profile_data = extract_profile_details(soup)
        print(json.dumps(profile_data, ensure_ascii=False, indent=4))
        return profile_data
    except Exception as e:
        print(f"Error testing with HTML file: {e}")
        return None

if __name__ == "__main__":

    base_url = "https://www.algeriejob.com/recherche-base-donnees-cv"
    all_profiles = scrape_search_results(base_url, pages=100, delay_range=(3, 7))
    save_profiles(all_profiles)
