import pytest


@pytest.mark.parametrize('expected', [
    "# http://localhost/batch_hub/type%3Dexperiment/hub.txt",
    "hub ENCODE_DCC_search",
    "shortLabel Hub (search:)",
    "longLabel ENCODE Data Coordination Center Data Hub",
    "genomesFile genomes.txt",
    "email encode-help@lists.stanford.edu",
])
def test_hub(testapp, workbook, expected):
    res = testapp.get("/batch_hub/type%3Dexperiment/hub.txt")
    assert expected in res.text

@pytest.mark.parametrize('expected', [
    "genome mm9",
    "trackDb mm9/trackDb.txt",
    "genome hg38",
    "trackDb hg38/trackDb.txt",
    "genome hg19",
    "trackDb hg19/trackDb.txt",
])
def test_genomes(testapp, workbook, expected):
    res = testapp.get("/batch_hub/type%3Dexperiment/genomes.txt")
    assert expected in res.text


@pytest.mark.parametrize('expected', [
    "track ENCSR575ZXX",
    "compositeTrack on",
    "type bed 3",
    "longLabel Encyclopedia annotation of chromatin state for IMR-90 - ENCSR575ZXX",
    "shortLabel chromatin state of IMR-90 ENCSR575ZXX",
    "visibility full",
    "pennantIcon https://www.encodeproject.org/static/img/pennant-encode.png https://www.encodeproject.org/ \"This trackhub was automatically generated from the ENCODE files and metadata found at the ENCODE portal\"",
    "subGroup1 view Views aENHAN=Candidate_enhancers bPROMO=Candidate_promoters cSTATE=Chromatin_state sPKS=Peaks",
    "subGroup2 BS Biosample IMR4590=IMR-90",
    "subGroup3 REP Replicates pool=Pooled",
    "sortOrder BS=+ REP=+ view=+",
    "    track ENCSR575ZXX_cSTATE_view",
    "    parent ENCSR575ZXX on",
    "    view cSTATE",
    "    type bigBed",
    "    visibility dense",
    "        track ENCFF762DWI",
    "        parent ENCSR575ZXX_cSTATE_view on",
    "        bigDataUrl /files/ENCFF762DWI/@@download/ENCFF762DWI.bigBed?proxy=true",
    "        longLabel Encyclopedia annotation of IMR-90 semi-automated genome annotation pool ENCSR575ZXX - ENCFF762DWI",
    "        shortLabel pool saga",
    "        type bigBed",
    "        subGroups BS=IMR4590 REP=pool view=cSTATE",
])
def test_dataset_trackDb(testapp, workbook, expected):
    res = testapp.get("/annotations/ENCSR575ZXX/@@hub/hg19/trackDb.txt")
    assert expected in res.text


@pytest.mark.parametrize('expected', [
    "track ENCSR727WCB",
    "compositeTrack on",
    "type bed 3",
    "longLabel Unknown Assay of Unknown Biosample - ENCSR727WCB",
    "shortLabel Unknown Assay of &#91;&#93; ENCSR727WCB",
    "visibility full",
    "pennantIcon https://www.encodeproject.org/static/img/pennant-encode.png https://www.encodeproject.org/ \"This trackhub was automatically generated from the ENCODE files and metadata found at the ENCODE portal\"",
    "subGroup1 view Views PK=Peaks SIG=Signals",
    "subGroup2 BS Biosample z9193=&#91;&#93;",
    "subGroup3 REP Replicates pool=Pooled",
    "sortOrder BS=+ REP=+ view=+",
    "dimensionAchecked pool",
    "    track ENCSR727WCB_PK_view",
    "    parent ENCSR727WCB on",
    "    view PK",
    "    type bigBed",
    "    visibility dense",
    "    spectrum on",
    "        track ENCFF003COS",
    "        parent ENCSR727WCB_PK_view on",
    "        bigDataUrl /files/ENCFF003COS/@@download/ENCFF003COS.bigBed?proxy=true",
    "        longLabel Unknown Assay of &#91;&#93; optimal idr thresholded peaks pool ENCSR727WCB - ENCFF003COS",
    "        shortLabel pool oIDR pk",
    "        type bigBed",
    "        subGroups BS=z9193 REP=pool view=PK"
])
def test_fileset_files_trackDb(testapp, workbook, expected):
    res = testapp.get("/publication-data/ENCSR727WCB/@@hub/hg19/trackDb.txt")
    assert expected in res.text


@pytest.mark.parametrize('expected', [
    "# Empty composite for ENCSR000ACY.  It cannot be visualized at this time.",
])
def test_experiment_trackDb(testapp, workbook, expected):
    res = testapp.get("/experiments/ENCSR000ACY/@@hub/trackDb.txt")
    assert expected in res.text


@pytest.mark.parametrize('expected', [
    "genome hg38",
    "trackDb hg38/trackDb.txt",
])
def test_genome_txt(testapp, workbook, expected):
    res = testapp.get("/batch_hub/type=Experiment&assembly=GRCh38/genomes.txt")
    assert expected in res.text

@pytest.mark.parametrize('expected', [
    "GRCh38",
    "hg19"
])
def test_assembly(testapp, workbook, expected):
    res = testapp.get("/experiments/ENCSR000AEN/")
    assert expected in res.json['assembly']


@pytest.mark.parametrize('expected', [
    "/experiments/ENCSR000AEN/@@hub/hub.txt",
])
def test_hub_field(testapp, workbook, expected):
    res = testapp.get("/experiments/ENCSR000AEN/")
    assert expected in res.json['hub']


def test_visualize_ucsc(testapp, workbook):
    expected = {
        'GRCh38': 'http://genome.ucsc.edu/cgi-bin/hgTracks?hubClear=http://localhost/experiments/ENCSR000AEN/@@hub/hub.txt&db=hg38',
        'hg19': 'http://genome.ucsc.edu/cgi-bin/hgTracks?hubClear=http://localhost/experiments/ENCSR000AEN/@@hub/hub.txt&db=hg19'
    }
    res = testapp.get("/experiments/ENCSR000AEN/")
    assert expected == res.json['visualize_ucsc']
