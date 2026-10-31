# Technical Project Inventory

Source profile: [github.com/abelfares17](https://github.com/abelfares17)

This inventory is based on accessible GitHub repositories, README files, repository metadata, file trees, Git history when available, and information explicitly provided by the user. Statements are marked as **Explicit** when supported by repository evidence or Git history, **Inferred** when derived cautiously, **User-provided context** when supplied directly by the user, and **TO_COMPLETE** when manual confirmation is still required. Personal ownership of a specific implementation is not assumed unless the available evidence supports it.

## Inventory Summary

| Project | Repository | Visibility | README evidence | Main visible stack | Primary relevance |
|---|---|---|---|---|---|
| Projet_Image | [Repository](https://github.com/abelfares17/Projet_Image) | Public | Detailed root README | C++17, OpenCV, Eigen, OpenMP, Make | Computer vision, image restoration, software engineering |
| Projet_Appliweb | [Repository](https://github.com/b-cb/Projet_Appliweb) | Public | Detailed root README; academic/local-only limitations documented | Java 21, Spring Boot 4, React 19, Vite, JPA/H2, JWT, WebSocket/STOMP | Software engineering, backend, full-stack, real-time web |
| Traitement_Image | [Repository](https://github.com/mhourde/Traitement_Image) | Public | No README; source, CMake, notes, and output images available | C++17, OpenCV 4, CMake; K-means and Mean-Shift | Computer vision, image processing, software |
| TAV_TP | [Repository](https://github.com/abelfares17/TAV_TP) | Public | No README; supporting report exists | MATLAB | Data, computer vision, signal/image processing |
| Voxel_Project | [Repository](https://github.com/abelfares17/Voxel_Project) | Public | Detailed root README; fully personal project (user-provided context) | Java, GLSL, OpenGL, LWJGL, Gradle | Software, 3D, graphics, simulation |
| ADA_huffman_compression | [Repository](https://github.com/abelfares17/ADA_huffman_compression) | Public | Detailed root README | Ada, GNAT, GPRbuild, Shell | Software, algorithms, systems |
| UE_Computer_Graphics | [Repository](https://github.com/abelfares17/UE_Computer_Graphics) | Public | Usable root README | Java, Make, custom rendering components | Software, 3D, graphics |
| Projet_graphes | [Repository](https://github.com/abelfares17/Projet_graphes) | Public | Detailed root README | Python, NetworkX, Matplotlib | Data, algorithms, simulation |
| Projet_mod_geom | [Repository](https://github.com/abelfares17/Projet_mod_geom) | Public | Usable but stale root README; code implements more than the status table reports | Python, NumPy, SciPy KDTree, Matplotlib 3D, Make | Scientific computing, geometry/modeling, simulation, Python software |
| TDL | [Repository](https://github.com/abelfares17/TDL) | Public | No root README; detailed nested README | OCaml, Dune, lexer/parser tools | Software, compilers, testing |
| abelfares17.github.io | [Repository](https://github.com/abelfares17/abelfares17.github.io) | Public | Minimal README | HTML, CSS, JavaScript, Tailwind CSS | Software, frontend |
| Sys_concurrents | [Repository](https://github.com/abelfares17/Sys_concurrents) | Public | No root README; several nested READMEs | Java, Make, java.util.concurrent | Software, concurrency, parallelism |

---

## Project Prioritization for Applications

### Primary projects to highlight

- Projet_Image — C++/OpenCV dehazing pipeline, Dark Channel Prior, soft matting, metrics and benchmarks. Benchmark reproduction remains TO_COMPLETE.
- Voxel_Project — Java/OpenGL voxel engine, rendering, chunk management, procedural terrain and software architecture.
- UE_Computer_Graphics — Java renderer, shaders, textures, lighting, normals and interactive rendering modes.
- Projet_graphes — Python graph analysis, NetworkX, visualization and simulation-oriented analysis.
- TDL — OCaml compiler project, language extensions, static analysis and code generation.
- ADA_huffman_compression — Ada implementation of Huffman compression, binary I/O and algorithmic software engineering.

### Secondary or coursework evidence

- Projet_Appliweb — academic/local-only multiplayer web prototype; secondary overall, but potentially primary for backend, full-stack or software-engineering applications.
- Projet_mod_geom — Python fish-school particle simulation and 3D scientific visualization; secondary overall, with useful evidence for scientific computing, modeling and simulation roles.
- Traitement_Image — C++/OpenCV image segmentation project; strong computer-vision evidence but needs README cleanup.
- TAV_TP — MATLAB signal, image and audio processing coursework collection.
- Sys_concurrents — Java concurrency and parallel systems coursework.
- abelfares17.github.io — frontend and public portfolio evidence.

---

## Projet_Image

### Project Name

Single Image Haze Removal with Dark Channel Prior

### Repository URL

https://github.com/abelfares17/Projet_Image

### Visibility

The repository is public at the time of this portfolio update. Earlier contribution analysis was performed when it was still private.

### Context and Attribution

This project was completed as a two-person academic project with `mhourde`.

**Explicit — Git history:** Abel Fares authored 17 of 20 commits. Maxence Hourde authored 3 commits.

**Explicit — filtered Git statistics:** after excluding generated files, binaries, datasets, result folders and other artifacts, Abel is attributed 3,618 additions and 610 deletions, while Maxence is attributed 76 additions and 13 deletions.

**Explicit — visible contribution areas:** Abel’s commits cover project structure, dark-channel computation, atmospheric-light estimation, transmission estimation, soft-matting refinement, pipeline integration, metrics, benchmark tooling, documentation and result exports. Maxence’s commits visibly cover scene recovery and the initial depth-map implementation.

**Inferred:** the Git history strongly supports that Abel authored most of the visible current implementation, documentation, benchmark tooling and pipeline integration. This does not measure pair programming, design discussions or work performed outside Git.

**TO_COMPLETE:** confirm the exact split of pair-programmed or jointly designed components with `mhourde`.

### Short Description

A C++17/OpenCV single-image dehazing project implementing a Dark Channel Prior pipeline with optional sparse soft-matting refinement, guided-filter upsampling, depth-map estimation, image-quality metrics and benchmark tooling for haze-removal datasets.

### Domain

- Computer vision
- Image restoration
- Image processing
- Scientific computing
- C++ software engineering

### Technical Stack

**Explicit from repository files and README:**

- C++17
- OpenCV 4
- OpenCV `ximgproc::guidedFilter`
- Eigen 3
- OpenMP
- Make and `config.mk`
- `std::filesystem`
- CSV benchmark exports

### What the Project Does

The project implements a dehazing pipeline for single images and benchmark datasets.

The visible pipeline includes:

- dark-channel computation through channel-wise minimum and erosion;
- atmospheric-light estimation from high dark-channel pixels;
- raw transmission estimation;
- optional sparse soft-matting refinement using Eigen;
- OpenMP-based construction of the matting system;
- downsampling and upsampling workflow;
- guided-filter transmission refinement;
- scene recovery using a minimum transmission threshold and gamma correction;
- depth-map estimation from transmission;
- PSNR, SSIM and CIEDE2000 metric computation;
- benchmark scripts for O-HAZE and RESIDE-style datasets;
- parameter sweeps and failure-case analysis.

### Implementation Highlights

**Explicitly visible in the repository:**

- Modular C++ source organization with `src/`, `include/`, `scripts/` and `tests/`.
- Make-based build configuration with OpenCV, Eigen and OpenMP.
- Full image-restoration pipeline from input image to intermediate maps, recovered image and metrics.
- Sparse-matrix refinement step using Eigen.
- Parallelized components using OpenMP.
- Benchmark and analysis programs for dataset-level evaluation.
- Technical documentation, including a soft-matting note.

### Evidence

- [Repository](https://github.com/abelfares17/Projet_Image)
- `README.md`
- `src/transmission.cpp`
- `src/main.cpp`
- `src/metrics.cpp`
- `src/scene_recovery.cpp`
- `src/depth_map.cpp`
- `tests/bench_ohaze.cpp`
- `tests/bench_reside.cpp`
- `tests/bench_params.cpp`
- `tests/bench_failure.cpp`
- `docs/soft_matting.md`
- committed metric summaries under `res/metrics/`

The repository and referenced evidence are publicly accessible at the time of this portfolio update.

### Possible Internship Relevance

- **Computer vision / image processing:** strong relevance through image restoration, dehazing, transmission estimation, soft matting, guided filtering and image-quality metrics.
- **Software engineering:** strong relevance through modular C++ implementation, build configuration, benchmark tools and documentation.
- **Data / research engineering:** relevant through dataset-level evaluation, metric computation, parameter sweeps and failure analysis.
- **AI / machine learning:** indirect relevance only; this project is algorithmic computer vision rather than learned deep-learning-based vision.
- **Graphics / simulation:** limited direct relevance, but useful for image-processing and visual-computing roles.

### Possible CV Bullet Points

Use only after confirming contribution wording and benchmark reproducibility:

- Made substantial visible contributions to a C++17/OpenCV dehazing pipeline based on the Dark Channel Prior, including transmission estimation, soft-matting refinement, pipeline integration and image-quality metrics.
- Implemented sparse Eigen/OpenMP-based transmission refinement with downsampling and guided-filter upsampling for image restoration.
- Built benchmark tooling for O-HAZE and RESIDE-style datasets with PSNR, SSIM, CIEDE2000, parameter sweeps and failure-case analysis.
- Collaborated in a two-person academic project; Maxence Hourde contributed visible work to scene recovery and the initial depth-map implementation.

Do not include benchmark values, speedups or dataset-level results in a CV until they are reproduced from a clean checkout.

### Missing Information to Complete Manually

- Keep the public README and portfolio description synchronized with the current repository state.
- Confirm pair-programmed or jointly designed components with `mhourde`.
- Reproduce the benchmarks from a clean checkout.
- Reconcile README reference values, benchmark constants and committed CSV files.
- Document dataset download instructions and licensing constraints.
- Explain why some detailed CSV files are empty or incomplete while summary files contain values.
- Add CI or at least clean build/test instructions.
- Separate unit tests, benchmarks and exploratory analysis scripts.

---

## Projet_Appliweb

### Project Name

Multiplayer Card Game Web Application (`Projet_Appliweb`)

### Repository URL

https://github.com/b-cb/Projet_Appliweb

### Visibility

Public. The repository is documented as an academic, local-development prototype and not as a production-ready service.

### Context and Attribution

**Explicit — repository and README:** the project has visible Git contributions from Batiste Cometbarthe, Abel Fares and Maxence Hourde.

**Explicit — visible contribution areas:** Git history attributes substantial visible work to Abel across authentication and Spring Security integration, backend services and DTOs, backend tests, WebSocket/chat/bot features, frontend lobby and game flows, the frontend API layer, Tarot logic and UI, architecture documentation, and later cleanup work.

**Inferred:** the visible history supports describing Abel’s contribution as substantial and cross-stack. It does not establish sole ownership of those components.

Git commit counts, line statistics and blame attribution are treated only as indicators of visible repository activity. They do not measure the full value of the work and may omit pair programming, design discussions, debugging, reviews or work performed outside Git.

**User-provided context:** the application remains an academic/local-only prototype, and its history has been cleaned to remove obsolete sensitive information.

**TO_COMPLETE:** confirm the precise division of work, course-provided scaffolding and any pair-programmed components with the other contributors.

### Short Description

An academic multiplayer card-game web prototype supporting Coinche and Tarot. It combines a React/Vite frontend with a Java/Spring Boot backend, authenticated REST operations, WebSocket/STOMP updates, JPA persistence, an H2 development database, rule-based bots and backend tests.

The project is intended for local development, coursework and technical demonstration. It is not production-ready and should not be presented as a deployed or security-hardened service.

### Domain

- Software engineering
- Backend engineering
- Full-stack web development
- Real-time web applications
- Authentication and persistence
- Multiplayer game logic

### Technical Stack

#### Frontend

- JavaScript
- React 19
- Vite 8
- React Router 7
- STOMP.js 7
- CSS
- Fetch API

#### Backend

- Java 21
- Spring Boot 4
- Spring MVC
- Spring Security
- Spring Data JPA
- Spring WebSocket
- JJWT
- Maven and Maven Wrapper

#### Database and Messaging

- H2 for local development and tests
- Hibernate / JPA entities and repositories
- REST with JWT bearer tokens
- WebSocket/STOMP topics for game-state and chat updates

PostgreSQL is mentioned in architecture documentation as a possible direction, but it is not configured as a runtime dependency in the current Maven project.

### What the Project Does

Visible features documented in the README and repository include:

- user registration and login;
- a lobby listing available games;
- game creation, joining, deletion and start workflows;
- Coinche gameplay;
- Tarot gameplay for three to five players;
- games with human players or rule-based bots;
- player invitations;
- in-game chat;
- bidding and card-play workflows;
- score calculation and multi-deal state;
- shared and per-player real-time updates;
- persistent users, games, players, cards, bids, tricks, messages and invitations.

### Implementation Highlights

**Explicitly visible in the repository:**

- separated React frontend and Spring Boot backend modules;
- controller, service, repository, entity and DTO layers;
- BCrypt password hashing and JWT-based REST authentication;
- lobby, Coinche and Tarot frontend flows;
- STOMP/WebSocket game-state and chat publication;
- JPA/H2 persistence with documented relational schemas;
- backend authentication, API integration, game-service and Tarot tests;
- local start/stop scripts with environment-based security configuration;
- Mermaid architecture and database diagrams.

### Evidence

- [Repository](https://github.com/b-cb/Projet_Appliweb)
- [Root README](https://github.com/b-cb/Projet_Appliweb/blob/main/README.md)
- `backend-cartes/pom.xml`
- `backend-cartes/src/main/java/`
- `backend-cartes/src/test/java/`
- `frontend-cartes/package.json`
- `frontend-cartes/src/`
- `schema_architecture.md`
- `schema_bdd.md`
- `schemas/`
- `start.sh` and `stop.sh`

### Security and Prototype Scope

- Security-sensitive values are configured through environment variables.
- H2 is a local-development database and its console is disabled by default.
- CORS and WebSocket origins are development-oriented.
- WebSocket connection authentication and per-player subscription authorization still require deeper hardening before non-local use.
- No production deployment, scale, adversarial-security or load-validation claim is made.

### Possible Internship Relevance

- **Software engineering:** strong relevance through a multi-module application, layered backend design, testing and cross-stack integration.
- **Backend engineering:** strong relevance through Spring services, REST controllers, JPA repositories, authentication and game logic.
- **Full-stack engineering:** direct relevance through React, Spring Boot and shared API workflows.
- **Real-time web:** relevant through STOMP/WebSocket game-state and chat updates.
- **Data engineering:** limited relevance through relational modeling and persistence.
- **AI:** limited evidence; the visible bots are rule-based rather than machine-learning systems.
- **Computer vision / 3D:** no direct relevance.

### Possible CV Bullet Points

Use only after confirming the contribution split and keeping the academic-prototype context explicit:

- Made substantial visible contributions to a Java/Spring Boot and React multiplayer card-game prototype spanning backend services, frontend game flows, real-time updates and tests.
- Contributed to JWT-based REST authentication, Spring Security integration and backend authentication/API tests without presenting the prototype as production-ready.
- Implemented or extended visible Coinche and Tarot workflows, including lobby/game interfaces, rule-based bot support, scoring logic and WebSocket-driven state updates.
- Worked across frontend and backend boundaries using React, Spring Boot, JPA/H2, REST and STOMP/WebSocket in a collaborative academic project.

Do not claim production deployment, production-grade security, user scale, performance, uptime or complete test coverage without additional evidence.

### Missing Information to Complete Manually

- Confirm the exact division of work and any pair-programmed components.
- Confirm the academic course context, project dates and team roles.
- Re-run and document backend tests from a clean checkout before citing test results.
- Add a frontend automated test suite if the project is developed further.
- Resolve current frontend lint and dependency-audit findings before presenting code quality as a strength.
- Complete WebSocket authentication and per-player subscription authorization before any non-local deployment.
- Add screenshots or a short local demo video.
- Confirm licensing or permitted reuse of card assets.
- Align contributor-name spelling and architecture-version documentation in the repository README.
- Keep PostgreSQL described as planned/documented only unless runtime support is actually added.

---

## Traitement_Image

### Project Name

Traitement_Image

### Repository URL

https://github.com/mhourde/Traitement_Image

### Short Description

A public C++17/OpenCV image-segmentation project comparing OpenCV K-means, custom spatial-color K-means and Mean-Shift-style segmentation workflows, with optional mask evaluation using precision, sensitivity and Dice.

- **Explicit:** the repository is public under `mhourde/Traitement_Image`.
- **Explicit:** the repository contains `src/tp/`, `src/tutorials/`, `data/images`, `res`, `CMakeLists.txt` and `notes.txt`.
- **Explicit:** the CMake configuration defines a C++17 project using OpenCV 4.
- **Explicit:** the source code includes K-means, Mean-Shift, Otsu mask generation and segmentation-evaluation logic.
- **User-provided context:** the project was completed in a two-person context with `mhourde`.
- **Inferred:** this is an academic image-processing project focused on segmentation experiments.
- **TO_COMPLETE:** confirm the exact pair-programming split and academic context.

### Context and Attribution

This project was completed as a two-person academic project with `mhourde`.

**Explicit — Git history:** Maxence Hourde appears under grouped identities `mhourde` and `mhe9472`, with 7 commits. Abel Fares has 2 commits.

**Explicit — filtered Git statistics:** after excluding generated build files, binaries, images and other artifacts, Maxence has 916 additions and 40 deletions, while Abel has 214 additions and 273 deletions.

**Explicit — visible contribution areas:** Maxence authored most of the visible project foundation, CMake configuration, OpenCV tutorial code, utility code and custom K-means implementation. Abel’s visible contributions focus on Mean-Shift integration and revision, command-line parameter handling, output naming, segmentation evaluation, notes and final cleanup.

**Inferred:** the final Mean-Shift implementation should be described as collaborative unless the exact split is confirmed manually, because the original standalone Mean-Shift file was committed by Maxence and later integrated or revised by Abel.

### Domain

- Image processing
- Computer vision
- Image segmentation
- C++ software development
- OpenCV-based experimentation

### Technical Stack

**Explicit from repository files:**

- C++17
- OpenCV 4
- CMake
- OpenCV `CommandLineParser`
- PNG/JPEG image processing
- CMake-generated build artifacts currently present in the repository

### What the Project Does

The project implements and compares image-segmentation approaches using OpenCV and custom C++ code.

Visible functionality includes:

- OpenCV K-means segmentation on BGR values;
- custom K-means in a spatial-color feature space `(B, G, R, λx, λy)`;
- custom Mean-Shift segmentation in a spatial window with a color-distance threshold;
- Otsu thresholding to obtain binary masks;
- optional comparison with ground-truth-like masks;
- precision, sensitivity and Dice computation;
- automatic foreground/background orientation selection based on Dice;
- result-image export for selected images and textures.

### Implementation Highlights

Based on visible repository evidence:

- CMake-based C++17 project structure.
- OpenCV dependency configured at project level.
- Source-code organization under `src/tp/` and `src/tutorials/`.
- Image data under `data/images`.
- Result images under `res/`.
- Parameter notes for Mean-Shift experiments in `notes.txt`.
- Segmentation evaluation against reference masks when available.

### Evidence

- [Repository](https://github.com/mhourde/Traitement_Image)
- [CMakeLists.txt](https://github.com/mhourde/Traitement_Image/blob/main/CMakeLists.txt)
- [notes.txt](https://github.com/mhourde/Traitement_Image/blob/main/notes.txt)
- `src/tp/kmeans.cpp`
- `src/tp/meanshift.cpp` in Git history
- `src/tutorials/`
- `data/images/`
- `res/`

### Possible Internship Relevance

- **Computer vision / image processing:** strong relevance through segmentation, K-means, Mean-Shift, Otsu thresholding, mask comparison and OpenCV workflows.
- **Software engineering:** relevant through C++, CMake, CLI parameter handling, output management and library integration.
- **Data science / AI:** partial relevance through clustering-style segmentation and evaluation metrics.
- **3D / graphics:** limited direct relevance.

### Possible CV Bullet Points

Use only after confirming contribution wording:

- Co-developed a C++17/OpenCV image-segmentation project comparing OpenCV K-means, custom spatial-color K-means and Mean-Shift segmentation.
- Contributed visible work to Mean-Shift integration, CLI parameter handling, result export and mask evaluation.
- Added or refined precision, sensitivity, Dice and foreground/background orientation handling for optional ground-truth comparison.
- Collaborated with Maxence Hourde, whose visible commits cover the initial CMake/OpenCV structure, custom K-means, tutorials and the first standalone Mean-Shift implementation.

Do not claim comparative performance, accuracy or final benchmark conclusions until results are reproduced and documented.

### Missing Information to Complete Manually

- Confirm exact pair-programming split with `mhourde`.
- Add a root README explaining objective, build/run commands, algorithms and results.
- Clean generated build outputs, binaries, `.DS_Store` and unnecessary result artifacts from version control.
- Explain the role of `_VT` files and whether they are ground-truth masks.
- Document image provenance and licensing.
- Add reproducible commands and expected outputs.
- Justify the `LAMBDA=120` spatial-color weighting if it remains in the code.
- Add a concise metric table if results are reproduced.

## TAV_TP

### Project Name

TAV_TP

### Repository URL

https://github.com/abelfares17/TAV_TP

### Short Description

A public MATLAB repository containing a sequence of practical assignments and datasets related to image, audio, signal-processing, and numerical-analysis topics.

- **Explicit:** GitHub identifies MATLAB as the primary language. The repository contains twelve `donnees_TP*` directories, MATLAB files, image/audio datasets, an instruction PDF, and `rapport_prep.md`.
- **Inferred:** The repository is an academic practical-work collection rather than a single deployable application.

### Domain

- Signal processing
- Image processing
- Computer vision
- Audio analysis
- Numerical methods

The domain classification is **inferred from the public file tree and explicitly described exercises in `rapport_prep.md`**.

### Technical Stack

- **Explicit:** MATLAB
- **Explicit from repository files:** MAT data files, image and audio assets
- **Explicit from `rapport_prep.md`:** FFT/TFCT operations, sparse matrices, image restoration, active contours, graph-like spectral matching concepts
- Libraries or MATLAB toolboxes required: TO_COMPLETE

### What the Project Does

The repository groups practical implementations covering topics such as:

- point-process-based object detection;
- total-variation image denoising and inpainting;
- patch-based inpainting;
- active contours and Gradient Vector Flow;
- frequency-domain image decomposition;
- audio fingerprinting and music recognition.

These topics are **explicitly described in the public `rapport_prep.md`**, but the repository has no root README that defines a single consolidated project objective.

### Implementation Highlights

- MATLAB implementations organized by practical assignment.
- Image-processing workflows using gradients, convolution, FFT, sparse operators, and iterative optimization.
- Audio-processing workflows using time-frequency analysis and spectral peak pairing.
- Public data folders containing image, MAT, WAV, and MP3 inputs.

Individual contribution, completeness, and reproducibility of each practical assignment: TO_COMPLETE

### Evidence

- [Repository](https://github.com/abelfares17/TAV_TP)
- [Supporting report preparation file](https://github.com/abelfares17/TAV_TP/blob/main/rapport_prep.md)
- **Explicit metadata:** primary language is MATLAB.
- **README quality:** no README found.

### Possible Internship Relevance

- **Computer vision / image processing:** strong potential relevance through restoration, segmentation, active contours, and frequency analysis.
- **Data science / AI:** relevant for numerical experimentation, data processing, optimization, and analysis pipelines.
- **Software engineering:** possible relevance, but architecture, testing, and code-quality evidence require manual documentation.
- **Simulation / graphics:** partial relevance through numerical and visual processing rather than a graphics engine.

### Possible CV Bullet Points

Use only after confirming personal contribution and selecting a specific assignment:

- Implemented MATLAB image-processing workflows for {{specific_topic}}, using {{verified_methods}} to process {{verified_dataset_or_input}}.
- Developed and compared {{verified_algorithms}} for {{verified_problem}}, documenting assumptions, parameters, and observed behavior.
- Built an audio or image analysis pipeline using {{verified_signal_processing_methods}} and produced {{verified_artifact}}.

### Missing Information to Complete Manually

- Select the strongest two or three assignments rather than presenting the repository as one project.
- Confirm personal contribution and whether work was individual or collaborative.
- Add setup instructions and required MATLAB toolboxes.
- Add reproducible commands or scripts for each selected result.
- Validate any metric before using it in a CV.
- Add screenshots, plots, or a concise English README.

---

## Voxel_Project

### Project Name

Voxel Game Engine

### Repository URL

https://github.com/abelfares17/Voxel_Project

### Context and Attribution

**User-provided context:** this is a fully personal project.

The project’s visible design and implementation can therefore be described as personal work. The README and repository remain the explicit evidence for individual systems and features; planned features listed in the README must not be presented as implemented.

### Short Description

A lightweight 3D voxel-based game engine built with Java and OpenGL. The README documents chunk-based procedural world generation, multithreaded mesh generation, rendering systems, persistence, and a custom user interface.

### Domain

- 3D graphics
- Game-engine development
- Rendering
- Simulation-style world generation
- Software engineering

### Technical Stack

**Explicit in the README and GitHub metadata:**

- Java 17
- GLSL
- OpenGL 3.2 Core Profile
- LWJGL 3.3.1
- GLFW
- JOML
- STB Image and STB TrueType
- Gradle 8.13
- Gson
- GZip-based world-save compression

### What the Project Does

The engine renders and manages a voxel world with procedural terrain, chunk tracking, first-person navigation, collision detection, lighting, UI screens, and persistent world metadata and chunk data.

### Implementation Highlights

**Explicitly documented in the README:**

- VAO/VBO-based OpenGL rendering pipeline.
- Greedy meshing and face culling for voxel chunks.
- Worker-thread pool for mesh generation.
- Noise-based height-map terrain generation.
- Texture atlas and GLSL shader architecture.
- Dynamic sun and shadow-map components.
- AABB collision detection.
- Game-state separation for menu, loading, and gameplay.
- Save/load system with compressed chunk files and JSON metadata.
- Custom interactive UI with text, buttons, fields, and scrollable lists.

### Evidence

- [Repository](https://github.com/abelfares17/Voxel_Project)
- [README](https://github.com/abelfares17/Voxel_Project/blob/main/README.md)
- GitHub language metadata reports Java and GLSL.
- Root metadata includes an MIT license and Gradle project files.
- The README documents known issues and planned features; planned features must not be presented as implemented.

### Possible Internship Relevance

- **Software engineering:** modular engine structure, state management, persistence, concurrency, and build tooling.
- **3D / graphics:** direct OpenGL, GLSL, shader, mesh, camera, texture, and shadow experience.
- **Simulation / game tech:** procedural terrain, chunk lifecycle, collision, and world-state systems.
- **Backend / data:** limited relevance through serialization and storage, but it is not documented as a backend project.

### Possible CV Bullet Points

The fully personal project context supports direct but evidence-bound wording:

- Designed and implemented a personal Java/OpenGL voxel engine with chunk-based procedural terrain, shader-based rendering and persistent compressed world storage.
- Implemented greedy voxel meshing, face culling and multithreaded mesh generation for chunk processing.
- Built modular rendering, UI, camera, collision and game-state systems using LWJGL, GLSL, JOML, Gson and Gradle.

No performance gain, frame rate, world size, or benchmark result should be claimed without additional evidence.

### Missing Information to Complete Manually

- Working demo, screenshots, or video linked prominently from the README.
- Automated test coverage and current build status.
- Measured performance: FPS, mesh-generation time, memory use, and render-distance limits.
- Confirmation that all README-listed features are present on the default branch.
- Architecture diagram and explanation of thread-safety decisions.

---

## ADA_huffman_compression

### Project Name

Huffman Compression

### Repository URL

https://github.com/abelfares17/ADA_huffman_compression

### Short Description

An Ada implementation of lossless text-file compression and decompression using Huffman coding, with a self-contained `.hff` format and bit-level binary I/O.

### Domain

- Algorithms and data structures
- Systems programming
- File formats and binary I/O
- Software engineering

### Technical Stack

**Explicit in the README and metadata:**

- Ada
- GNAT
- GPRbuild
- Shell tooling
- Generic Ada packages
- Binary stream I/O

GitHub also reports small amounts of DTrace and D metadata; their exact purpose is TO_COMPLETE.

### What the Project Does

The project analyzes symbol frequencies, builds a Huffman tree, generates variable-length codes, writes a compressed binary file containing reconstruction metadata, and decompresses the file back to text.

### Implementation Highlights

**Explicitly documented:**

- Greedy Huffman-tree construction.
- Generic binary-tree and linked associative-list modules.
- Bit-level octet manipulation and stream I/O.
- Serialized symbol table and inorder tree traversal in the `.hff` format.
- Compression and decompression command-line programs.
- Tree-module unit tests and several input cases.
- Explicit handling of empty input and documented ASCII-only limitations.

### Evidence

- [Repository](https://github.com/abelfares17/ADA_huffman_compression)
- [README](https://github.com/abelfares17/ADA_huffman_compression/blob/main/README.md)
- **Explicit contribution statement in README:** Abel Fares is credited with the compression module, argument handling, and integration.
- The README provides build, usage, architecture, test, limitation, and authorship sections.

### Possible Internship Relevance

- **Software engineering:** modular architecture, CLI behavior, integration, tests, and error handling.
- **Algorithms:** tree construction, frequency maps, greedy coding, and serialization.
- **Systems:** binary representation, streams, custom file format, and decompression reconstruction.
- **Data / AI:** limited direct relevance, but demonstrates algorithmic implementation and data encoding.

### Possible CV Bullet Points

- Implemented the documented compression-side components of an Ada Huffman encoder/decoder, including the compression pipeline, command-line argument handling and integration work.
- Helped integrate generic tree, associative-list and octet modules into a self-contained `.hff` compression format without claiming sole authorship of those modules.
- Contributed to build and test workflow validation with GNAT and GPRbuild across the documented input cases.

Do not claim a compression ratio, speed, or binary-file support; none is demonstrated in the README.

### Missing Information to Complete Manually

- Confirm the exact scope of personal work beyond the README authorship statement.
- Add compression-ratio and execution-time benchmarks if measured reproducibly.
- Add CI configuration and test output.
- Clarify the small DTrace/D language metadata entries.
- Add a release or sample compressed artifact if useful.

---

## UE_Computer_Graphics

### Project Name

A “Do It Yourself” Renderer

### Repository URL

https://github.com/abelfares17/UE_Computer_Graphics

### Short Description

A Java rendering engine with a graphical interface for selecting scene models, shaders, rasterization modes, textures, lighting, and normal visualization.

### Domain

- Computer graphics
- Rendering
- 3D software
- Software engineering

### Technical Stack

- **Explicit metadata:** Java and Makefile
- **Explicit README:** Java application, custom shader abstraction, rendering modes, textures, lighting, normals, and GUI
- **Explicit repository files:** Make, Checkstyle configuration, test directory, build documentation
- Exact GUI framework and rendering implementation details: TO_COMPLETE

### What the Project Does

The application loads scene files and lets users interactively choose models, shaders, textures, wireframe/vertex/face rendering modes, lighting, and normal display options.

### Implementation Highlights

**Explicit in the README:**

- Extensible shader architecture based on an abstract `Shader` class.
- Automatic listing of added shader classes after recompilation.
- Scene-file selection and texture selection through a GUI.
- Wireframe, vertex, and face rendering modes.
- Lighting and vertex-normal display options.
- Make targets for build, run, tests, and cleanup.

The internal rasterization algorithms and individual contribution are not explained in sufficient detail and remain TO_COMPLETE.

### Evidence

- [Repository](https://github.com/abelfares17/UE_Computer_Graphics)
- [README](https://github.com/abelfares17/UE_Computer_Graphics/blob/main/README.md)
- [Build documentation](https://github.com/abelfares17/UE_Computer_Graphics/blob/main/BUILD.md)
- GitHub identifies Java as the primary language.
- Screenshots are linked from the README.

### Possible Internship Relevance

- **3D / graphics:** direct relevance through rendering modes, shaders, textures, lighting, normals, scenes, and rasterization.
- **Software engineering:** extensibility, GUI integration, build automation, style checks, and tests.
- **Simulation:** possible visualization relevance, but no simulation system is explicitly documented.

### Possible CV Bullet Points

Validate personal contribution before use:

- Developed or extended a Java renderer supporting multiple scene models, shaders, textures, and wireframe, vertex, and face rendering modes.
- Built an interactive GUI for configuring rendering options, lighting, and normal visualization.
- Structured an extensible shader system and automated build, test, and code-quality tasks with Make and Checkstyle.

### Missing Information to Complete Manually

- Personal role, team size, and exact components implemented.
- Rendering pipeline details and algorithms used.
- External libraries or GUI toolkit.
- Supported scene format and parser design.
- Test scope and results.
- Performance metrics and additional visual examples.

---

## Projet_graphes

### Project Name

Lunar Nanosatellite Swarm Graph Analysis

### Repository URL

https://github.com/abelfares17/Projet_graphes

### Short Description

A Python graph-analysis project modeling a lunar-orbit nanosatellite swarm for an interferometry application across multiple density and communication-range configurations.

### Domain

- Graph theory
- Data analysis
- Scientific computing
- Network modeling
- Simulation-oriented analysis

### Technical Stack

**Explicit in the README and metadata:**

- Python
- NetworkX
- Matplotlib
- CSV input data
- 2D and 3D interactive visualization

### What the Project Does

The project constructs unweighted and weighted graphs from three topology datasets, analyzes connectivity and graph structure, and provides interactive visualizations. Weighted analysis uses squared distance as edge cost for a documented 60 km range configuration.

### Implementation Highlights

**Explicit in the README:**

- Nine unweighted configurations combining three densities and three ranges.
- Degree, clustering, clique, connected-component, shortest-path, and diameter analysis.
- Weighted shortest paths with Dijkstra.
- Minimum spanning tree analysis with Kruskal.
- Weighted closeness centrality.
- 2D and rotatable 3D interactive visualization modes.
- Text and histogram outputs.

### Evidence

- [Repository](https://github.com/abelfares17/Projet_graphes)
- [README](https://github.com/abelfares17/Projet_graphes/blob/main/README.md)
- GitHub metadata identifies Python as the repository language.
- The repository contains input CSV files, generated histogram directories, and result text files.

### Possible Internship Relevance

- **Data science:** graph statistics, comparative analysis, visualization, and CSV data processing.
- **Software / algorithms:** command-line modes, Dijkstra, Kruskal, and graph data structures through NetworkX.
- **Simulation / research engineering:** modeling a nanosatellite network under varying topology parameters.
- **AI:** indirect relevance only; no machine-learning model is documented.

### Possible CV Bullet Points

Validate individual ownership and any result values before use:

- Modeled a lunar nanosatellite swarm as weighted and unweighted graphs across multiple density and communication-range configurations using Python and NetworkX.
- Implemented graph analyses covering connectivity, clustering, cliques, shortest paths, minimum spanning trees, and weighted centrality.
- Developed interactive 2D/3D Matplotlib visualizations and generated comparative statistical and histogram outputs.

### Missing Information to Complete Manually

- Personal role and whether the project was individual or collaborative.
- Dataset provenance and coordinate units.
- Exact graph-construction rules and range values.
- Key findings from the generated analyses.
- Validation method and reproducible environment specification.
- Screenshots or a short demo linked from the README.

---

## Projet_mod_geom

### Project Name

3D Fish-School Geometric Modeling and Simulation (`Projet_mod_geom`)

### Repository URL

https://github.com/abelfares17/Projet_mod_geom

### Visibility

Public.

### Context and Attribution

**Explicit — Git history:** seven visible commits are authored by Abel Fares and one commit is authored as `ebd0846` on the current main-branch history.

**Explicit — visible contribution areas:** commit messages attribute project architecture, initial Trafalgar work, the Aoki module, density influence, fish-style visualization and the visual-influence network to Abel.

**Inferred:** the repository provides strong evidence of substantial personal implementation by Abel, but it should not be described as fully personal while the `ebd0846` contribution remains unclarified.

Commit counts are indicators of visible repository activity, not an absolute measure of work or design ownership.

**TO_COMPLETE:** identify `ebd0846`, clarify that contribution and document whether any project framework or starter material was provided.

### Short Description

A modular Python particle-system simulation of collective fish-school behavior in 3D. The code models random motion, propagation of behavioral changes, Aoki-style repulsion/alignment/attraction rules, topological-neighbor influence through a SciPy KDTree, and a visual influence network based on a field-of-view cone.

The simulation is rendered interactively with Matplotlib 3D. It is a scientific/geometric modeling project rather than a GPU rendering engine.

### README Evidence Quality

The root README provides installation commands, dependencies, project structure and the intended five-part model. However, its status table still marks parts 2–5 as `TODO`, while corresponding source modules and runnable scripts are present in the repository.

**TO_COMPLETE:** update the README status table and correct the duplicated `run-p4` command for part 5 (`Makefile` defines `run-p5`).

### Domain

- Geometric modeling
- Particle systems
- Collective-behavior simulation
- Scientific computing
- Computational geometry / neighborhood search
- 3D scientific visualization
- Python software architecture

Computer graphics relevance is limited to custom Matplotlib 3D visualization; no OpenGL, shader or GPU-rendering implementation is visible.

### Technical Stack

**Explicit from repository files:**

- Python
- NumPy
- Matplotlib and `mplot3d`
- SciPy `cKDTree`
- Python dataclasses
- Make
- `venv` and `requirements.txt`
- Windows setup batch script

No notebook, `pyproject.toml`, automated test suite or persisted result dataset is visible.

### What the Project Does

The repository implements a configurable school of fish represented by particles with 3D positions and velocities.

Visible simulation modes include:

1. **Random movement:** perturbed velocity with fixed speed magnitude and boundary reflection.
2. **Trafalgar effect:** leader selection and propagation of direction or behavior within a configurable radius and interval.
3. **Aoki rules:** weighted repulsion, alignment and attraction zones.
4. **Density influence:** Aoki forces restricted to the nearest topological neighbors found with `scipy.spatial.cKDTree`.
5. **Visual influence network:** Aoki forces restricted to neighbors inside a configurable vision cone.

### Inputs and Outputs

#### Inputs

- simulation parameters stored in a `SimConfig` dataclass;
- mode-specific scripts under `simulations/`;
- optional random seeds for reproducibility;
- no external dataset is required by the visible code.

#### Outputs

- interactive Matplotlib 3D animation;
- custom fish meshes built from triangular faces;
- optional velocity-vector visualization;
- step number and mode-specific titles.

No persisted metrics, benchmark table, validation dataset or quantitative result is present.

### Implementation Highlights

**Explicitly visible in the code:**

- separation between configuration, core entities, physics modules, simulation dispatch and visualization;
- vectorized NumPy positions and velocities;
- modular `step(school, config, step_count)` physics interface;
- configurable random seeds and simulation parameters;
- SciPy KDTree nearest-neighbor search;
- vision-cone filtering using normalized direction vectors and dot products;
- interactive Matplotlib `Poly3DCollection` fish rendering and velocity quivers;
- Make targets for environment installation and each simulation mode.

### Evidence

- [Repository](https://github.com/abelfares17/Projet_mod_geom)
- [README](https://github.com/abelfares17/Projet_mod_geom/blob/main/README.md)
- `src/config.py`
- `src/core/fish.py`
- `src/core/school.py`
- `src/core/simulation.py`
- `src/physics/movement.py`
- `src/physics/trafalgar.py` and `trafalgar_2.py`
- `src/physics/aoki.py`
- `src/physics/density.py`
- `src/physics/visual_network.py`
- `src/visualization/renderer.py`
- `simulations/`
- `requirements.txt` and `Makefile`
- project PDFs under `docs/`

### Possible Internship Relevance

- **Data / algorithms:** relevant through vector calculations, neighborhood queries and configurable simulation logic.
- **Geometry / modeling:** direct relevance through 3D particle positions, direction vectors, distance zones and vision cones.
- **Scientific computing:** strong relevance through NumPy, SciPy and parameterized numerical simulation.
- **Python software:** relevant through modular package structure, configuration and multiple executable entry points.
- **Simulation / research engineering:** relevant through collective-behavior models and scientific visualization.
- **Computer graphics / 3D:** supporting evidence for 3D visualization, but not for GPU graphics or rendering-engine work.
- **AI:** no learned model, training pipeline or machine-learning evaluation is visible.

### Possible CV Bullet Points

Use contribution-aware wording until the remaining author identity is clarified:

- Made substantial visible contributions to a modular Python simulation of collective fish-school behavior in 3D using NumPy, SciPy and Matplotlib.
- Implemented visible Aoki-style repulsion, alignment and attraction rules, KDTree-based topological neighborhoods and vision-cone influence filtering.
- Built a configurable simulation dispatcher and interactive Matplotlib 3D renderer with custom fish geometry and velocity visualization.

Do not claim physical accuracy, biological validation, runtime performance, scalability or quantitative results without additional evidence.

### Missing Information to Complete Manually

- Identify `ebd0846` and clarify the exact contribution split.
- Update the README status table to match the implemented source modules.
- Correct the README command for part 5.
- Add automated tests for movement, neighborhood selection, force computation and boundary handling.
- Add screenshots or a short simulation video.
- Document expected qualitative behavior and a validation method for each model.
- Add persisted result examples only if they are reproducible.
- Clarify project dates, academic context and any supplied starter material.
- Pin or record tested dependency versions more precisely if reproducibility is important.

---

## TDL

### Project Name

RAT Language Compiler and Extensions

### Repository URL

https://github.com/abelfares17/TDL

### Short Description

An OCaml compiler project for the RAT language. Public source and nested documentation show lexical and syntactic analysis, progressive compilation passes, symbol-table and type handling, TAM code generation, and language extensions.

### Domain

- Compilers
- Programming languages
- Software engineering
- Static analysis and testing

### Technical Stack

**Explicit metadata and repository files:**

- OCaml
- Dune
- `ocamllex`-style lexer source (`lexer.mll`)
- `ocamlyacc`/Menhir-style parser source (`parser.mly`); the exact parser generator is TO_COMPLETE
- TAM target/runtime files
- RAT test programs

### What the Project Does

The repository implements a compiler pipeline for RAT and documents extensions for procedures, enumerated types, pointers, and pass-by-reference parameters.

### Implementation Highlights

**Explicit in the nested README and file tree:**

- Lexer and parser stages.
- Abstract syntax tree transformations.
- Identifier/symbol-table, type, placement, and code-generation passes.
- Procedures with `void` behavior.
- User-defined enumerations.
- Dynamic allocation and pointer operations.
- Pass-by-reference parameters.
- Dune-based test suites organized by compiler stage and language feature.

### Evidence

- [Repository](https://github.com/abelfares17/TDL)
- [Extensions README](https://github.com/abelfares17/TDL/blob/main/ressources/README_EXTENSIONS.md)
- GitHub metadata identifies OCaml as the primary language.
- Root file names explicitly expose the compiler stages and a substantial structured test tree.
- The nested README reports approximately 600 lines added, 14 tests, and a 100% pass rate. These are README-reported claims and should be independently validated before CV use.

### Possible Internship Relevance

- **Software engineering:** multi-pass architecture, typed interfaces, modular code, error handling, and testing.
- **Compilers / systems:** parsing, ASTs, symbol tables, static typing, memory-related language constructs, and code generation.
- **Research engineering:** relevant to formal language tooling and implementation of language semantics.
- **Data / AI / 3D:** no direct evidence beyond general software-engineering skills.

### Possible CV Bullet Points

Validate personal contribution and reported metrics before use:

- Extended an OCaml compiler for the RAT language with procedures, enumerated types, pointers, and pass-by-reference semantics across analysis and code-generation passes.
- Implemented or updated lexer/parser, AST, symbol-table, type-checking, placement, and TAM code-generation components for new language constructs.
- Organized Dune test suites by compiler stage and feature; validate the README-reported test count and pass rate before including numbers.

### Missing Information to Complete Manually

- Exact personal contribution and team context.
- Parser-generator and OCaml version.
- Which files and passes were personally modified.
- Independent test command output and current pass count.
- Example input/output demonstrating each extension.
- Clarification of README references to local `/tmp` and home-directory documentation that is not public.

---

## abelfares17.github.io

### Project Name

E-Portfolio Website

### Repository URL

https://github.com/abelfares17/abelfares17.github.io

### Short Description

A public GitHub Pages repository described as an e-portfolio page, containing multiple static pages for academic, career, mobility, sports, sustainability, and civic-engagement content.

### Domain

- Frontend web development
- Static-site development
- Personal portfolio

### Technical Stack

**Explicit metadata and repository files:**

- HTML
- CSS
- JavaScript
- Tailwind CSS 4
- PostCSS
- Autoprefixer
- npm package metadata
- GitHub Pages is enabled according to repository metadata

### What the Project Does

**Inferred from metadata and public filenames:** the repository publishes a multi-page personal e-portfolio covering engineering studies, career planning, international mobility, activities, and civic engagement.

The root README only says “E-portfolio page,” so detailed functionality is TO_COMPLETE.

### Implementation Highlights

- Multiple static HTML/CSS pages.
- Tailwind CSS configuration and generated stylesheet workflow.
- GitHub Pages publishing enabled.
- JavaScript is present in GitHub language metadata, but its exact behavior is TO_COMPLETE.

### Evidence

- [Repository](https://github.com/abelfares17/abelfares17.github.io)
- [README](https://github.com/abelfares17/abelfares17.github.io/blob/main/README.md)
- GitHub metadata reports HTML, CSS, and JavaScript.
- `package.json` explicitly lists Tailwind CSS, PostCSS, and Autoprefixer development dependencies.
- **README quality:** minimal and not sufficient to explain architecture or features.

### Possible Internship Relevance

- **Software / frontend:** demonstrates static-site structure, CSS styling, web tooling, and public deployment.
- **International applications:** potentially useful as a public presentation artifact.
- **Data / AI / 3D:** no direct evidence.

### Possible CV Bullet Points

Validate personal contribution and deployed URL before use:

- Developed and published a multi-page e-portfolio using HTML, CSS, JavaScript, Tailwind CSS, and GitHub Pages.

### Missing Information to Complete Manually

- Public deployed URL and confirmation that all pages work.
- Personal role and design ownership.
- Responsive behavior and accessibility checks.
- JavaScript functionality.
- Browser compatibility and performance evidence.
- Screenshots and a useful English README.
- Whether Tailwind is used consistently across all pages.

---

## Sys_concurrents

### Project Name

Concurrent and Parallel Systems Coursework

### Repository URL

https://github.com/abelfares17/Sys_concurrents

### Short Description

A Java repository organized around monitor-based synchronization, regulated parallelism, and CSP-style message-passing exercises.

### Domain

- Concurrent programming
- Parallel algorithms
- Synchronization
- Software engineering
- Systems programming

### Technical Stack

**Explicit metadata and nested READMEs:**

- Java
- Make
- `java.util.concurrent`
- `ReentrantLock` and `Condition`
- Threads, thread pools, `ExecutorService`, `Future`, and Fork/Join
- Synchronous channels, guarded alternatives, and CSP-style coordination

### What the Project Does

The repository contains exercises and implementations for:

- producer/consumer coordination;
- readers/writers synchronization;
- dining philosophers;
- resource allocation;
- sequential, thread-based, pool-based, and Fork/Join array processing;
- CSP-style readers/writers, dining philosophers, and single-track coordination.

The nested READMEs mix complete examples, exercise specifications, and conceptual guidance. They do not establish which implementations were personally completed.

### Implementation Highlights

**Explicit from the public file tree and nested documentation:**

- Multiple readers/writers and philosopher strategy classes.
- Lock/condition monitor implementations.
- Parallel maximum and interval-counting variants using threads, pools, and Fork/Join.
- Benchmark classes and large-array data tooling.
- CSP channel, guarded-channel, alternative-selection, and priority-selection abstractions.
- GUI/simulator classes for several synchronization problems.

### Evidence

- [Repository](https://github.com/abelfares17/Sys_concurrents)
- [Monitor README](https://github.com/abelfares17/Sys_concurrents/blob/main/TP1-2/TP-Moniteur/README.md)
- [Parallelism README](https://github.com/abelfares17/Sys_concurrents/blob/main/TP3/TP-Parallel/README.md)
- [CSP README](https://github.com/abelfares17/Sys_concurrents/blob/main/TP4/TP-CSP/README.md)
- GitHub metadata identifies Java as the primary language.
- **Important limitation:** the READMEs describe coursework and requested exercises; they do not by themselves prove completion or personal authorship.

### Possible Internship Relevance

- **Software engineering:** concurrency control, synchronization design, decomposition, testing, and performance measurement.
- **Backend / systems:** thread pools, shared-state coordination, resource management, and message passing.
- **Data / simulation:** possible relevance for parallel processing and simulator-based exercises.
- **AI / graphics:** no direct project evidence.

### Possible CV Bullet Points

Use only after identifying personally completed components:

- Implemented Java synchronization strategies for {{verified_problem}} using {{ReentrantLock_and_Condition_or_CSP_channels}}.
- Compared sequential, thread-pool, and Fork/Join implementations of {{verified_algorithm}} on {{verified_dataset_size}}, documenting {{verified_measurement}}.
- Developed concurrent coordination logic for {{verified_readers_writers_philosophers_or_allocator_component}} with explicit safety and fairness constraints.

### Missing Information to Complete Manually

- Identify which files are original work versus instructor-provided scaffolding.
- Confirm personally completed exercises and strategies.
- Add benchmark outputs only after reproducible execution.
- Document correctness properties, deadlock handling, fairness, and race-condition testing.
- Add a root README separating completed work from assignment instructions.
- Remove generated `.class` files if appropriate and document the build process.

---

## Manual Completion Priorities

1. Add a concise English root README to `TAV_TP`, `TDL`, and `Sys_concurrents`.
2. Expand the e-portfolio README with its live URL, architecture, screenshots, and setup instructions.
3. Confirm individual versus team contributions for every repository.
4. Validate all candidate CV bullets against actual personal work.
5. Add reproducible build/test commands and current test output.
6. Add measurable results only where a repeatable benchmark or evaluation exists.
7. Add screenshots or short demos for the renderer, voxel engine, graph analysis, and selected TAV assignments.
8. Clearly label coursework scaffolding, supplied code, and original implementation.
