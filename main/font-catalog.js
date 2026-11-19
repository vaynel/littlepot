"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontChoices = exports.bundledFonts = void 0;
// Bundled unmodified OFL 1.1 fonts. License texts ship beside each font.
exports.bundledFonts = [
    {
        "id": "default",
        "family": "Gowun Dodum",
        "file": "GowunDodum-Regular.ttf",
        "license": "gowundodum-OFL.txt",
        "source": "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/gowundodum/GowunDodum-Regular.ttf",
        "sha256": "a6e457933227483a11758fd0947bc74422a106d46f0bf057fdaa5af94a30067d"
    },
    {
        "id": "flowers",
        "family": "Gowun Batang",
        "file": "GowunBatang-Regular.ttf",
        "license": "gowunbatang-OFL.txt",
        "source": "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/gowunbatang/GowunBatang-Regular.ttf",
        "sha256": "466c593e7147412e748af4856d5ad14709b5a860bdf62b9c2546f2c5874e9849"
    },
    {
        "id": "files",
        "family": "Nanum Gothic",
        "file": "NanumGothic-Regular.ttf",
        "license": "nanumgothic-OFL.txt",
        "source": "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/nanumgothic/NanumGothic-Regular.ttf",
        "sha256": "76f45ef4a6bcff344c837c95a7dcc26e017e38b5846d5ae0cdcb5b86be2e2d31"
    },
    {
        "id": "runner",
        "family": "IBM Plex Sans KR",
        "file": "IBMPlexSansKR-Regular.ttf",
        "license": "ibmplexsanskr-OFL.txt",
        "source": "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/ibmplexsanskr/IBMPlexSansKR-Regular.ttf",
        "sha256": "53750379270312368cf7641901f43a98dd892e3d9d5798cf25cdc245c85c71c0"
    },
    {
        "id": "night",
        "family": "Nanum Myeongjo",
        "file": "NanumMyeongjo-Regular.ttf",
        "license": "nanummyeongjo-OFL.txt",
        "source": "https://raw.githubusercontent.com/google/fonts/23e54b51ddffbc7713c583748e3bd86f62b1fa4a/ofl/nanummyeongjo/NanumMyeongjo-Regular.ttf",
        "sha256": "7ed9e8653a8ed04285d51dc343ffea6eb3d9c73afc27383ea8929ee4ffd03205"
    }
];
exports.fontChoices = ['theme', 'system', 'custom', ...exports.bundledFonts.map(f => f.id)];
