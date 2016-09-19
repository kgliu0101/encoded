module.exports = {
    "@id": "/biosamples/ENCBS087RNA/",
    "@type": ["Biosample", "Item"],
    "accession": "ENCBS087RNA",
    "aliases": ["thomas-gingeras:K562-1"],
    "award": "/awards/U54HG007005/",
    "biosample_term_id": "EFO:0002067",
    "biosample_term_name": "K562",
    "biosample_type": "immortalized cell line",
    "culture_harvest_date": "2013-03-06",
    "culture_start_date": "2013-02-28",
    "description": "The continuous cell line K-562 was established by Lozzio and Lozzio from the pleural effusion of a 53-year-old female with chronic myelogenous leukemia in terminal blast crises. ENCODE3 RNA-seq evaluation replicate 1.",
    "donor": require('../donor/encdo000hum'),
    "lab": "/labs/brenton-graveley/",
    "lot_id": "59300853",
    "note": "K562 cell line replicate 1 used inENCODE3 RNA-seq evaluation",
    "organism": require('../organism/human'),
    "passage_number": 5,
    "product_id": "CCL-243",
    "source": require('../source'),
    "starting_amount": 100000.0,
    "starting_amount_units": "cells/ml",
    "submitted_by": require('../submitter'),
    "summary": "K562 cell line replicate 1 used inENCODE3 RNA-seq evaluation",
    "summary_object": {temp: "K562"},
    "treatments": [require('../treatment/CHEBI34730')],
    "url": "http://www.atcc.org/Products/All/CCL-243.aspx",
    "uuid": "2ee883ef-b0dd-4305-a69b-d881de132795"
};