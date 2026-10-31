# Technical Stack Evidence Matrix

## Purpose and Evidence Policy

This document summarizes technologies and technical areas found in `config/profile.yaml` and `docs/portfolio/projects.md`. It does **not** assign proficiency levels or claim professional experience.

Confidence describes the strength of the available evidence, not skill level:

- **High** — explicit implementation evidence, explicit contribution evidence, or repeated evidence across substantial projects.
- **Medium** — clearly present in a project, but personal scope, depth, recency, or reproducibility still needs clarification.
- **Low** — declared in the profile, weakly inferred, or mentioned without a sufficiently documented project artifact.

Evidence status vocabulary:

- **Implemented** — visible code or documentation supports implementation work.
- **Used** — the technology is visibly part of a project stack or workflow.
- **Experimented** — visible coursework or exploratory use, without evidence of production-depth use.
- **Documented** — declared in the profile or project documentation, but implementation evidence is incomplete.
- **TO_VERIFY** — manual confirmation or stronger evidence is required before prominent CV use.

## Core Programming Languages

| Category | Technology | Evidence from projects | Status | Confidence | How to present it in a CV | Relevance | Missing proof or clarification needed |
|---|---|---|---|---|---|---|---|
| Language | C++ / C++17 | `Projet_Image` contains substantial visible C++ contributions across a modular OpenCV pipeline; `Traitement_Image` contains shared C++ segmentation work. | Implemented | High | “C++17 for computer-vision pipelines, numerical image processing and CLI tooling.” | Software; computer vision; research engineering | Keep the pair-work attribution explicit; reproduce benchmark results before citing them. |
| Language | Java | `Projet_Appliweb` shows substantial visible backend contributions; `Voxel_Project` is a fully personal Java engine; `UE_Computer_Graphics` and `Sys_concurrents` provide additional academic evidence. | Implemented / used | High | “Java for Spring Boot backend services and a personal OpenGL voxel engine.” | Software; backend/full-stack; systems; 3D/graphics | Clarify personal scope only in the renderer and concurrency coursework; keep Voxel performance claims evidence-bound. |
| Language | Python | `Projet_graphes` uses Python for graph analysis and visualization. `Projet_mod_geom` contains a modular NumPy/SciPy fish-school simulation, multiple physics modules and Matplotlib 3D rendering, with seven visible commits attributed to Abel. | Implemented / used | High | “Python for graph analysis, scientific modeling, numerical simulation and 3D visualization.” | Data/AI; software; geometry/modeling; simulation; research engineering | Clarify the `ebd0846` contribution in `Projet_mod_geom`, confirm personal scope in `Projet_graphes`, and add reproducible tests/results. |
| Language | JavaScript | `Projet_Appliweb` contains visible React/frontend/API contributions; the e-portfolio also uses JavaScript. | Implemented / used | High | “JavaScript for React interfaces, REST integration and real-time web clients.” | Software; backend/full-stack | Confirm exact frontend ownership and add frontend tests or lint cleanup before emphasizing code quality. |
| Language | TypeScript | Declared in the profile, but no documented project in `projects.md` demonstrates TypeScript implementation. | Documented / TO_VERIFY | Low | Do not list prominently; use only as “familiarity” after adding a verifiable artifact. | Software; backend/full-stack | Add a TypeScript project, code sample or migration with a clear personal contribution. |
| Language | SQL | Declared in the profile; `Projet_Appliweb` documents relational schemas, H2/JPA persistence and a database-backed architecture. Direct SQL depth is not strongly documented. | Used indirectly / TO_VERIFY | Medium | “Relational data modeling and H2/JPA persistence”; avoid claiming advanced SQL. | Backend/full-stack; data | Add explicit queries, schema migrations or database exercises showing direct SQL work. |
| Language | Ada | `ADA_huffman_compression` explicitly credits Abel with compression-side components, argument handling and integration. | Implemented | High | “Ada implementation of documented Huffman compression components and CLI integration.” | Software; systems; algorithms | Confirm exact test/build responsibilities and avoid claiming authorship of all shared modules. |
| Language | OCaml | `TDL` documents an OCaml compiler and language extensions, but exact personal contribution is unresolved. | Used / TO_VERIFY | Medium | “OCaml compiler coursework involving multi-pass analysis and language extensions,” only after contribution confirmation. | Software; systems; research engineering | Confirm files/passes personally implemented and independently rerun the tests. |
| Language | MATLAB | `TAV_TP` contains image/audio/signal-processing coursework; current `Problèmes inverses pour la 3D` coursework includes practical photogrammetry and 3D-reconstruction implementations. | Current coursework / experimented | Medium | “MATLAB coursework in image processing, photogrammetry and 3D reconstruction”; keep it academic/current-learning. | Data/AI; computer vision; 3D; research engineering | Identify specific assignments, required toolboxes and reproducible outputs. |
| Language | GLSL | `Voxel_Project` is a fully personal project with GLSL resources and a documented shader architecture. | Implemented / used | High | “GLSL shaders in a personal Java/OpenGL voxel engine.” | 3D/graphics/simulation | Link representative shader files and visual outputs; do not claim measured rendering performance without benchmarks. |
| Language / scripting | Shell / Bash | Build/run scripts are visible in `Projet_Appliweb`; shell tooling is also present in the Ada project. | Used | Medium | “Bash scripting for local build, startup and test workflows.” | Software; backend/full-stack; systems | Identify scripts personally authored and document portability constraints. |

## Software, Backend and Full-Stack

| Category | Technology | Evidence from projects | Status | Confidence | How to present it in a CV | Relevance | Missing proof or clarification needed |
|---|---|---|---|---|---|---|---|
| Backend | Spring Boot | `Projet_Appliweb` uses Spring Boot 4 with visible contributions across services, controllers, authentication and cleanup. | Implemented / used | High | “Spring Boot backend services for an academic multiplayer web prototype.” | Software; backend/full-stack | Keep the academic/local-only scope explicit; do not claim production deployment. |
| Backend | Spring MVC / REST APIs | `Projet_Appliweb` documents and implements authenticated REST operations; REST APIs are also declared in the profile. | Implemented | High | “Designed or extended REST controllers and frontend API integration in Spring Boot.” | Software; backend/full-stack | Confirm exact endpoints personally implemented and avoid claiming complete API ownership. |
| Backend | Spring Data JPA / Hibernate | `Projet_Appliweb` contains JPA entities, repositories, services and relational schemas. | Used / implemented | High | “JPA/Hibernate persistence with entities, repositories and service-layer integration.” | Backend/full-stack; data | Clarify which entities/repositories were personally implemented and add migration/versioning evidence if available. |
| Database | H2 | `Projet_Appliweb` uses H2 for local development and tests. | Used | High | “H2-backed local persistence for an academic Spring application.” | Backend/full-stack; testing | Do not present H2 as a production database; document direct database work separately. |
| Authentication | JWT / JJWT | `Projet_Appliweb` has visible JWT and Spring Security contribution evidence; the README clearly limits the security scope. | Implemented / used | High | “Contributed to JWT-based REST authentication in a local academic prototype.” | Software; backend/full-stack | Avoid “production-grade security”; complete WebSocket authentication and maintain safe configuration. |
| Authentication | BCrypt / Spring Security | Password hashing and security configuration are documented in `Projet_Appliweb`. | Used / implemented | High | “Spring Security and BCrypt-based authentication flows in an academic prototype.” | Backend/full-stack | Confirm exact security components owned; avoid implying a complete security review. |
| Real-time web | WebSocket / STOMP | `Projet_Appliweb` publishes game and chat updates through WebSocket/STOMP; visible Abel contributions include WebSocket/chat work. | Implemented / used | High | “Real-time game-state and chat updates with Spring WebSocket and STOMP.js.” | Software; backend/full-stack; real-time systems | Authentication and per-player subscription authorization still require hardening. |
| Frontend | React | `Projet_Appliweb` contains visible React lobby/game contributions; the e-portfolio is separate static frontend evidence. | Implemented / used | High | “React interfaces for lobby, Coinche/Tarot game flows and backend integration.” | Software; backend/full-stack | Resolve lint issues, confirm component ownership and add frontend tests. |
| Frontend tooling | Vite / React Router | Explicitly documented in `Projet_Appliweb`. | Used | High | Include as supporting tooling under the React project, not as standalone skills. | Software; backend/full-stack | Add a verified clean lint/build snapshot if used as portfolio evidence. |
| Frontend / messaging | STOMP.js | Explicitly used in the `Projet_Appliweb` client. | Used | High | Present with WebSocket as part of the real-time client stack. | Full-stack; real-time systems | Clarify client reconnection and authentication work personally implemented. |
| Frontend | HTML / CSS | `Projet_Appliweb` and the e-portfolio contain HTML/CSS; visible frontend styling contributions exist in the web application. | Implemented / used | High | “HTML/CSS and component styling for React and static portfolio interfaces.” | Software; frontend/full-stack | Verify responsive behavior and accessibility before claiming them. |
| Frontend | Tailwind CSS | The e-portfolio metadata documents Tailwind CSS 4, but the README is minimal and personal design scope is unclear. | Used / TO_VERIFY | Medium | Mention only in the e-portfolio stack after confirming actual usage across pages. | Software; frontend/full-stack | Verify generated styles, responsive behavior and design ownership. |
| Backend framework | FastAPI | Declared in the profile, but no project in `projects.md` provides implementation evidence. | Documented / TO_VERIFY | Low | Do not list prominently until a backend project or code sample is documented. | Software; backend/full-stack; AI serving | Add a FastAPI service with endpoints, tests and a repository link. |
| Backend runtime | Node.js | Declared in the profile and indirectly present as frontend tooling, but no Node.js backend is documented. | Documented / used as tooling | Low | Avoid presenting Node.js as backend experience; at most list it as frontend tooling. | Software; backend/full-stack | Add a Node.js service or clarify the exact runtime work performed. |

## Computer Vision, Data and AI

| Category | Technology or area | Evidence from projects | Status | Confidence | How to present it in a CV | Relevance | Missing proof or clarification needed |
|---|---|---|---|---|---|---|---|
| Computer vision | OpenCV | `Projet_Image` provides substantial visible OpenCV pipeline evidence; `Traitement_Image` provides shared OpenCV segmentation evidence. | Implemented | High | “OpenCV for dehazing, transmission estimation, segmentation, mask generation and evaluation.” | Computer vision; software; research engineering | Keep pair attribution explicit and separate verified code from unreproduced benchmark claims. |
| Computer vision | Image restoration / dehazing | `Projet_Image` documents Dark Channel Prior, transmission refinement, guided filtering and scene recovery. | Implemented | High | “Implemented visible components of a Dark Channel Prior dehazing pipeline.” | Computer vision; research engineering | Reproduce benchmark outputs before citing quality or speed results. |
| Computer vision | Image segmentation | `Traitement_Image` compares OpenCV K-means, custom spatial-color K-means, Mean-Shift and Otsu masks. | Implemented collaboratively / experimented | Medium | “Collaborative C++/OpenCV segmentation project using K-means and Mean-Shift.” | Computer vision; data/AI | Confirm algorithm ownership, ground-truth provenance and reproducible evaluation. |
| Numerical computing | Eigen | `Projet_Image` uses Eigen sparse matrices in soft-matting refinement, with strong visible contribution evidence. | Implemented / used | High | “Eigen sparse linear algebra for transmission refinement.” | Computer vision; research engineering; software | Add a concise architecture explanation and reproduced memory/runtime measurements if cited. |
| Parallel computing | OpenMP | `Projet_Image` documents OpenMP-based sparse-system construction. | Implemented / used | High | “OpenMP parallelization for image-processing matrix construction.” | Software; systems; computer vision; research engineering | Reproduce performance comparisons before claiming speedups. |
| Evaluation | PSNR / SSIM / CIEDE2000 | Metric implementations and benchmark tools are visible in `Projet_Image`. | Implemented | High | “Implemented image-quality metrics and dataset benchmark tooling”; omit numeric results until reproduced. | Computer vision; data; research engineering | Reproduce benchmarks and reconcile detailed/summary CSV artifacts. |
| Data / algorithms | NetworkX | `Projet_graphes` explicitly uses NetworkX for graph analysis, Dijkstra, Kruskal, components and centrality. | Used | Medium | “NetworkX graph analysis for a nanosatellite-network model.” | Data; algorithms; simulation; research engineering | Confirm personal contribution and dataset construction rules. |
| Numerical computing | NumPy | `Projet_mod_geom` visibly uses NumPy for 3D positions, velocities, force vectors, random initialization, normalization and geometry calculations. | Implemented / used | High | “NumPy for vectorized 3D particle simulation and geometric calculations.” | Data; scientific computing; simulation; research engineering | Clarify the remaining contributor’s scope and add automated numerical tests. |
| Scientific computing | SciPy `cKDTree` | `Projet_mod_geom` uses `scipy.spatial.cKDTree` for nearest topological-neighbor queries in the density model; the related commit is attributed to Abel. | Implemented / used | High | “SciPy KDTree nearest-neighbor search for a 3D collective-behavior simulation.” | Data; geometry/modeling; simulation; research engineering | Add correctness tests and document expected scaling without inventing performance claims. |
| Data visualization | Matplotlib / `mplot3d` | `Projet_graphes` documents graph visualizations; `Projet_mod_geom` contains an interactive 3D fish renderer with `Poly3DCollection` and velocity quivers. | Implemented / used | High | “Matplotlib for interactive graph analysis and custom 3D scientific visualization.” | Data; geometry/modeling; simulation; research engineering | Add screenshots/videos and clarify personal scope in `Projet_graphes`. |
| Scientific computing | MATLAB image/audio processing | `TAV_TP` documents restoration, active contours, FFT/TFCT and audio fingerprinting coursework. | Experimented | Medium | Select two or three concrete assignments rather than claiming broad mastery. | Data/AI; computer vision; research engineering | Confirm personal implementation, toolbox requirements and reproducible artifacts. |
| Machine learning | K-means / Mean-Shift | Algorithms are visible in `Traitement_Image`; they are classical clustering/segmentation methods, not deep learning. | Implemented collaboratively / experimented | Medium | “Implemented or evaluated classical clustering methods for image segmentation.” | Data/AI; computer vision | Confirm contribution split and evaluation protocol. |
| AI framework | PyTorch | Declared in the profile; no documented project evidence in `projects.md`. | Documented / TO_VERIFY | Low | Do not claim applied PyTorch experience without a project artifact. | Data/AI; computer vision; research engineering | Add model, dataset, training/evaluation method and repository evidence. |
| AI framework | TensorFlow | Declared in the profile; no documented project evidence in `projects.md`. | Documented / TO_VERIFY | Low | Do not list as a strong skill without evidence. | Data/AI; computer vision | Add a verifiable TensorFlow project or remove from targeted CV variants. |
| Data library | scikit-learn | Declared in the profile; no documented project evidence. | Documented / TO_VERIFY | Low | Use only after documenting a concrete model or analysis. | Data/AI | Add dataset, preprocessing, estimator and evaluation evidence. |
| Data library | pandas | Declared in the profile; project documentation does not establish substantive use. | Documented / TO_VERIFY | Low | Avoid prominent listing until a data workflow is documented. | Data/AI; backend data processing | Add a reproducible data-cleaning or analysis artifact. |
| AI area | Deep Learning | Declared in the profile; no documented model implementation or training pipeline. | Documented / TO_VERIFY | Low | Do not present as demonstrated expertise. | Data/AI; computer vision | Add architecture, dataset, training process, metrics and reproducible code. |
| AI area | LLMs | Declared in the profile; no documented LLM project evidence. | Documented / TO_VERIFY | Low | Do not list prominently until there is a concrete implementation. | Data/AI; backend/full-stack; research engineering | Add an LLM application or research artifact with evaluation and clear contribution. |
| AI area | MLOps | Listed as a secondary target domain; no pipeline, registry, serving or experiment-tracking project is documented. | Documented / TO_VERIFY | Low | Treat as a target area, not an evidenced competency. | Data/AI; backend; research engineering | Add model serving, experiment tracking, deployment or monitoring evidence. |

## 3D, Graphics and Simulation

| Category | Technology or area | Evidence from projects | Status | Confidence | How to present it in a CV | Relevance | Missing proof or clarification needed |
|---|---|---|---|---|---|---|---|
| Graphics API | OpenGL | `Voxel_Project` is a fully personal project and explicitly documents an OpenGL 3.2 Core Profile rendering pipeline. | Implemented / used | High | “Designed and implemented an OpenGL rendering pipeline for a personal voxel engine.” | 3D/graphics/simulation; software | Add current build evidence, screenshots and measured performance only when reproducible. |
| Graphics libraries | LWJGL / GLFW / JOML | The fully personal `Voxel_Project` explicitly uses LWJGL, GLFW and JOML for graphics, window/input handling and mathematics. | Implemented / used | High | “LWJGL/GLFW/JOML stack for a personal Java/OpenGL engine.” | 3D/graphics/simulation; software | Link representative integration code and document platform support with tested evidence. |
| Graphics | Computer graphics / rendering | The fully personal `Voxel_Project` documents rendering, textures, lighting, shadows, camera and mesh systems; `UE_Computer_Graphics` provides additional academic renderer evidence. | Implemented / used | High | “Computer graphics and rendering through a personal Java/OpenGL voxel engine.” | 3D/graphics/simulation; software | Personal scope remains TO_VERIFY only for `UE_Computer_Graphics`; add visual and test evidence for Voxel. |
| Graphics | Shader programming | The fully personal `Voxel_Project` contains GLSL voxel, UI, text and depth/shadow shader resources; `UE_Computer_Graphics` documents a separate shader abstraction. | Implemented / used | High | “Implemented GLSL shader systems for voxel, UI, text and depth rendering.” | 3D/graphics/simulation | Link representative shaders and avoid unmeasured quality/performance claims. |
| Game technology | Voxel engine / procedural terrain | Fully personal `Voxel_Project` documents chunk management, greedy meshing, procedural terrain, collision, persistence, UI and a worker-thread pool. | Implemented | High | “Designed and implemented a personal Java/OpenGL voxel engine with modular world, rendering and UI systems.” | 3D/graphics/simulation; software | Add a current demo, tests, architecture diagram and reproducible performance measurements. |
| Engine | Unity | Declared in the profile; no documented Unity project in `projects.md`. | Documented / TO_VERIFY | Low | Do not list prominently until a Unity artifact is documented. | 3D/graphics/simulation; game tech | Add repository, demo, role and implemented systems. |
| Engine | Unreal Engine | Declared in the profile; no documented Unreal project evidence. | Documented / TO_VERIFY | Low | Do not list prominently without a project. | 3D/graphics/simulation; game tech | Add repository/demo and exact implementation contribution. |
| Tool | Blender | Declared in the profile; no documented Blender workflow or artifact. | Documented / TO_VERIFY | Low | Use only after adding visual or asset-pipeline evidence. | 3D/graphics/simulation | Add models, renders, scripts or asset-processing examples. |
| 3D vision | Photogrammetry / 3D reconstruction | User-confirmed current study in `Problèmes inverses pour la 3D`, covering theoretical photogrammetry and 3D reconstruction with practical MATLAB implementations. | Current coursework / experimented | Medium | “Current coursework in theoretical photogrammetry and 3D reconstruction, with MATLAB implementations.” | Computer vision; 3D/graphics; research engineering | Academic/current-learning evidence only; identify specific methods and outputs before stronger claims. Do not claim SLAM. |
| Simulation | Simulation / scientific modeling | `Projet_mod_geom` provides a modular 3D collective-behavior particle simulation; `Projet_graphes` models a nanosatellite network; fully personal `Voxel_Project` provides simulation-style world systems. | Implemented / used | High | “Python scientific modeling and 3D particle simulation, complemented by graph and game-world systems.” | Simulation; data; geometry/modeling; research engineering | Clarify the non-Abel commit in `Projet_mod_geom`, personal scope in `Projet_graphes`, and distinguish scientific models from game simulation. |
| Emerging domains | Robotics / Digital Twins | Listed as secondary target domains; no project evidence in `projects.md`. | Documented / TO_VERIFY | Low | Present as interests, not demonstrated skills. | Simulation; research engineering | Add a robotics or digital-twin project with concrete hardware/software scope. |

## Systems, Algorithms and Research Engineering

| Category | Technology or area | Evidence from projects | Status | Confidence | How to present it in a CV | Relevance | Missing proof or clarification needed |
|---|---|---|---|---|---|---|---|
| Algorithms | Huffman coding | `ADA_huffman_compression` explicitly credits compression-side implementation and integration work. | Implemented | High | “Implemented documented Huffman compression components in Ada.” | Software; systems; algorithms | Add reproducible compression tests; do not invent compression-ratio results. |
| Systems | Binary I/O / custom file format | The Ada project documents octet handling and a self-contained `.hff` format; module ownership is shared. | Used / integrated | Medium | “Helped integrate binary I/O and a custom compressed-file format.” | Systems; software | Confirm exact ownership of octet/tree/list modules. |
| Compilers | Multi-pass compiler architecture | `TDL` documents lexer/parser, AST, symbol-table, type, placement and code-generation passes. | Used / TO_VERIFY | Medium | “OCaml compiler coursework with multi-pass analysis,” pending contribution confirmation. | Software; systems; research engineering | Confirm personally modified passes, parser generator and current tests. |
| Concurrency | Java concurrency / multithreading | Fully personal `Voxel_Project` documents a worker-thread pool for mesh generation; `Sys_concurrents` adds monitor, thread-pool, Fork/Join and CSP-style coursework. | Implemented / experimented | High | “Implemented multithreaded mesh generation in a personal Java engine; additional Java concurrency coursework.” | Software; backend; systems; 3D/graphics | Add thread-safety documentation and measurements; separate supplied coursework scaffolding from personal concurrency code. |
| Graph algorithms | Dijkstra / Kruskal / connectivity / centrality | Explicitly documented in `Projet_graphes`. | Used | Medium | “Applied graph algorithms with NetworkX to a nanosatellite-network model.” | Data; algorithms; simulation; research engineering | Confirm personal implementation versus library orchestration and document findings. |
| Research workflow | Technical documentation and benchmark design | `Projet_Image`, `Projet_Appliweb`, Ada, graph and compiler projects contain technical documentation and test/benchmark structures. | Implemented / used | High | “Documented architecture, assumptions, limitations and reproducible workflows across academic projects.” | Software; research engineering | Link the strongest reports and keep unreproduced metrics clearly caveated. |

## Build, Testing and Development Tools

| Category | Technology or practice | Evidence from projects | Status | Confidence | How to present it in a CV | Relevance | Missing proof or clarification needed |
|---|---|---|---|---|---|---|---|
| Version control | Git | Declared in the profile and evidenced by multi-contributor repository histories. | Used | High | “Git-based collaborative project development”; avoid using commit counts as a skill metric. | All target areas | Add examples of branching, review or conflict resolution only if verified. |
| Build | Make | Used in `Projet_Image`, `UE_Computer_Graphics` and other projects. | Used | High | “Make-based C++/Java project builds.” | Software; systems; computer vision; graphics | Clarify which Makefiles were authored personally. |
| Build | CMake | Explicit in `Traitement_Image`. | Used collaboratively | Medium | “CMake configuration for a collaborative C++/OpenCV project.” | Software; computer vision; systems | Confirm personal build-configuration contribution and clean generated artifacts. |
| Build | Maven | Explicit in `Projet_Appliweb`. | Used | High | “Maven/Spring Boot build and backend test workflow.” | Software; backend/full-stack | Keep dependency and warning cleanup separate from demonstrated build use. |
| Build | Gradle | The fully personal `Voxel_Project` uses Gradle 8 with wrapper scripts and documented build/run tasks. | Used | High | “Gradle build tooling for a personal Java/OpenGL engine.” | Software; 3D/graphics | Add current clean-build evidence and any personally authored custom tasks if relevant. |
| Build | Dune | Explicit in `TDL`; personal scope unresolved. | Used / TO_VERIFY | Medium | Mention with OCaml compiler coursework after confirmation. | Software; systems; research engineering | Confirm commands and current test results. |
| Build | GNAT / GPRbuild | Explicit in the Ada Huffman project. | Used | High | “GNAT/GPRbuild for Ada compilation and documented tests.” | Software; systems | Confirm test-workflow contribution and current reproducibility. |
| Frontend tooling | npm | Explicit in `Projet_Appliweb` and e-portfolio metadata. | Used | High | Supporting tool under JavaScript/React projects. | Software; frontend/full-stack | Resolve dependency-audit findings before claiming a clean dependency posture. |
| Testing | Spring backend tests | `Projet_Appliweb` documents authentication, API integration, service and Tarot tests, with visible Abel test contributions. | Implemented / used | High | “Contributed backend unit and integration tests for authentication, APIs and game logic.” | Software; backend/full-stack | Cite test counts or pass rates only after a clean, current execution. |
| Testing / evaluation | C++ benchmarks and image metrics | `Projet_Image` contains benchmark programs, parameter sweeps and failure analysis. | Implemented | High | “Built image-processing benchmark and failure-analysis tooling”; omit result numbers until reproduced. | Computer vision; data; research engineering | Reconcile CSV artifacts and rerun from a clean environment. |
| Code quality | ESLint / Checkstyle | ESLint exists in `Projet_Appliweb`; Checkstyle is visible in `UE_Computer_Graphics`. Clean status is not established. | Used / documented | Medium | Mention as project tooling, not as evidence of a clean codebase. | Software; frontend/full-stack; graphics | Resolve current lint findings and verify Checkstyle execution. |
| Containers | Docker | Declared in the profile, but no documented project demonstrates containerization. | Documented / TO_VERIFY | Low | Do not list prominently until a Dockerfile or container workflow is documented. | Software; backend/full-stack; MLOps | Add Dockerfile, compose workflow and verified local run. |
| Cloud | Cloud providers/services | No evidence in `projects.md`; none is specified in the profile. | TO_VERIFY | Low | Do not list. | Backend/full-stack; MLOps | Add a documented cloud deployment or remove from planned stack. |
| DevOps | CI/CD | No workflow or pipeline is documented in the available projects. | TO_VERIFY | Low | Do not claim CI/CD experience from this portfolio. | Software; backend/full-stack; MLOps | Add a tested CI workflow with build, lint and tests. |
| DevOps | Monitoring / observability / IaC | No project evidence. | TO_VERIFY | Low | Do not list. | Backend/full-stack; MLOps | Add metrics/logging or infrastructure-as-code artifacts. |

## CV-Oriented Stack Summary

### Strongest Evidence for Software / Backend / Full-Stack

- Java, Spring Boot, Spring MVC, Spring Security, Spring Data JPA
- REST APIs, JWT/JJWT, BCrypt
- React, JavaScript, Vite, React Router
- WebSocket/STOMP real-time updates
- H2/JPA persistence
- Maven and backend testing
- C++17 modular software and CLI pipelines

Recommended framing:

> Software engineering projects across Java/Spring Boot/React full-stack development and C++ computer-vision pipelines, with visible contributions to backend services, REST authentication, real-time updates, testing, numerical processing and technical documentation.

### Strongest Evidence for Computer Vision / Research Engineering

- C++17 and OpenCV
- Dark Channel Prior dehazing and transmission refinement
- Eigen sparse linear algebra
- OpenMP parallelization
- Guided filtering
- PSNR, SSIM and CIEDE2000 implementations
- K-means and Mean-Shift image segmentation
- MATLAB image/signal-processing coursework

Recommended framing:

> C++/OpenCV computer-vision work covering image restoration, segmentation, numerical refinement, image-quality metrics and benchmark tooling, with unreproduced performance or quality figures deliberately excluded.

### Strongest Evidence for 3D / Graphics / Simulation

- Fully personal Java/OpenGL voxel-engine design and implementation
- LWJGL, GLFW and JOML integration
- Java renderer project evidence
- GLSL voxel/UI/text/depth shader systems
- multithreaded mesh generation and engine architecture
- Python/NumPy/SciPy 3D fish-school simulation and Matplotlib scientific visualization
- graph-based simulation-oriented modeling
- current theoretical photogrammetry and 3D-reconstruction coursework with MATLAB implementations

Recommended framing:

> Designed and implemented a personal Java/OpenGL voxel engine covering rendering, shaders, chunk meshing, procedural terrain, UI, persistence and multithreaded mesh generation; complemented by Python 3D scientific simulation and separate renderer coursework.

### Strongest Evidence for Data / Algorithms / Systems

- Python, NumPy, SciPy KDTree and Matplotlib 3D scientific modeling
- Python, NetworkX and Matplotlib graph analysis
- Huffman coding and Ada integration
- OCaml compiler architecture exposure
- Java concurrency coursework
- graph algorithms and numerical image-processing methods

## Priority Evidence Gaps

1. Confirm personal contributions in `UE_Computer_Graphics`, `Projet_graphes`, `TDL` and `Sys_concurrents`, and clarify the `ebd0846` contribution in `Projet_mod_geom`.
2. Reproduce `Projet_Image` benchmarks before citing any metrics or speedups.
3. Add concrete projects for PyTorch, TensorFlow, scikit-learn, pandas, deep learning and LLMs.
4. Add evidence for TypeScript, FastAPI, Node.js backend development, Docker and MLOps.
5. Add project evidence for Unity, Unreal Engine and Blender; add reproducible photogrammetry/3D-reconstruction coursework outputs before presenting more than current academic exposure.
6. Add frontend tests and resolve lint/dependency findings in `Projet_Appliweb` before presenting frontend quality as a strength.
7. Add screenshots, demos and current build/test evidence for graphics projects.
8. Keep all team-project descriptions scoped to visible contributions rather than whole-project ownership.

## Usage Guidelines

- Treat confidence as evidence quality, not proficiency.
- Match each CV variant to the relevant project evidence.
- Prefer “implemented,” “contributed to,” “used,” or “experimented with” over unsupported expertise claims.
- Keep academic and local-only prototype limitations visible where relevant.
- Do not cite benchmark values, test pass rates, performance gains or deployment scale without a current reproducible run.
- Remove low-confidence technologies from a targeted CV unless the role requires them and supporting evidence is added first.
