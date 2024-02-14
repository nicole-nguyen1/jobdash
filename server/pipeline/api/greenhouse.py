import html
from collections import namedtuple
from typing import NamedTuple
from urllib import parse

import requests
from flask import jsonify
from pipeline.api.importer import Importer


class GreenhouseImporter(Importer):
    def import_from_url(self) -> NamedTuple:
        split_url = parse.urlsplit(self.url)
        split_path = split_url.path.split('/')

        company_name = split_path[1]
        job_id = split_path[3]

        job_listing_api_url = 'https://boards-api.greenhouse.io/v1/boards/{0}/jobs/{1}'.format(
            company_name, job_id)
        job_listing_response = requests.get(job_listing_api_url)
        job_listing_json = job_listing_response.json()

        company_name_api_url = 'https://boards-api.greenhouse.io/v1/boards/{0}'.format(
            company_name)
        company_name_response = requests.get(company_name_api_url)
        company_name_json = company_name_response.json()

        tuple = namedtuple('Fields',
                           ['company_name',
                            'title',
                            'url',
                            'location',
                            'working_model',
                            'description',
                            'min_salary',
                            'max_salary'])

        location = job_listing_json.get('location')
        salaries = job_listing_json.get('pay_input_ranges')
        content = job_listing_json.get('content')
        min_salary = None
        max_salary = None

        if (salaries is not None):
            salaries = salaries[0]
            min_salary = salaries.get('min_cents')
            max_salary = salaries.get('max_cents')

        data = tuple(
            company_name_json.get('name'),
            job_listing_json.get('title'),
            job_listing_json.get('absolute_url'),
            location.get('name'),
            'NULL',
            html.unescape(content),
            min_salary,
            max_salary
        )

        return data
