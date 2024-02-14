from pipeline.api.greenhouse import GreenhouseImporter


def ATSFactory(ats):
  ats_systems = {
    'GREENHOUSE': GreenhouseImporter
  }
  return ats_systems[ats]