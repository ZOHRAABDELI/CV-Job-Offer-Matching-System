import json
import os.path
import pathlib


from .parsers.ParseJobDescToJson import ParseJobDescription
from .ReadPdf import read_single_pdf

READ_JOB_DESCRIPTION_FROM = "Data/JobDescription/"
SAVE_DIRECTORY = "Data/Processed/JobDescription"


class JobDescriptionProcessor:
    def __init__(self, input_file):
        self.input_file = input_file

        self.input_file_name = os.path.join(READ_JOB_DESCRIPTION_FROM, input_file)

    def _read_job_desc(self) -> dict:
        # Pass the file path directly to ParseJobDescription, not the content
        output = ParseJobDescription(self.input_file_name).get_JSON()
        return output

    def process(self) -> bool:
        try:
            resume_dict = self._read_job_desc()
            self._write_json_file(resume_dict)
            return True
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return False


    def _write_json_file(self, resume_dictionary: dict):
        file_name = str(
            "JobDescription"
            + ".json"
        )
        save_directory_name = pathlib.Path(SAVE_DIRECTORY) / file_name
        json_object = json.dumps(resume_dictionary, sort_keys=True, indent=14)
        with open(save_directory_name, "w+") as outfile:
            outfile.write(json_object)
