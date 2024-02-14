from typing import NamedTuple


class Importer():

  def __init__(self, url: str):
    self.url = url

  def import_from_url(self) -> NamedTuple:
    print(self.url)