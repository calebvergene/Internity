from models import Application

def skill_set():
    skill_set = {
    # Programming Languages
    "python", "java", "c++", "c#", "javascript", "typescript", "ruby", "go", "rust",
    "swift", "kotlin", "php", "r", "scala", "perl", "matlab", "bash", "shell", "haskell",
    "objective-c", "dart", "lua", "groovy", "elixir", "clojure", "html", "css", "coffeescript",
    "visual basic", "assembly", "fortran", "cobol", "actionscript", "erlang", "scheme",

    # Web Development Frameworks & Libraries
    "django", "flask", "spring", "rails", "express", "react", "angular", "vue.js",
    "next.js", "nuxt.js", "ember.js", "svelte", "laravel", "symfony", "asp.net", "blazor",
    "tailwind css", "bootstrap", "material-ui", "daisyui", "foundation", "bulma", "semantic-ui", 
    "backbone.js", "marionette.js", "knockout.js", "ember.js", "mithril.js", "tailwindcss", "tailwind",

    # Databases & Data Management
    "sql", "mysql", "postgresql", "sqlite", "oracle", "mongodb", "redis", "cassandra",
    "couchdb", "neo4j", "dynamodb", "firebase", "elasticsearch", "graphql", "json", 
    "xml", "influxdb", "couchbase", "excel", "microsoft sql server", "teradata", "db2", 
    "hbase", "solr", "splunk", "redshift", "bigquery", "clickhouse", "greenplum", "vertica", 
    "snowflake", "timescale db", "amazon rds", "aurora", "sybase",

    # DevOps & CI/CD Tools
    "docker", "kubernetes", "jenkins", "travis ci", "circleci", "gitlab ci", "teamcity",
    "ansible", "puppet", "chef", "terraform", "vagrant", "nomad", "prometheus", "grafana",
    "splunk", "new relic", "datadog", "github actions", "azure devops", "ci/cd",
    "continuous integration", "continuous deployment", "serverless architecture", "openshift",
    "helm", "kafka", "flink", "airflow", "luigi", "argo cd", "tekton", "drone", "packer",
    "vault", "jenkins x", "spinnaker", "argocd", "bamboo", "puppet enterprise", "octopus deploy",

    # Cloud Platforms
    "aws", "azure", "google cloud", "gcp", "ibm cloud", "heroku", "digitalocean", 
    "netlify", "vercel", "cloudflare", "firebase", "microsoft azure", "aws lambda", 
    "openstack", "oracle cloud", "rackspace", "sap cloud", "salesforce", "alibaba cloud",
    "ovh cloud", "vultr", "linode", "backblaze", "wasabi", "cloud foundry", "cloud run",
    "fargate", "lambda edge", "lambda@edge", "cloud functions", "app engine", "tencent cloud",

    # Version Control & Collaboration
    "git", "github", "gitlab", "bitbucket", "svn", "mercurial", "jira", "trello",
    "confluence", "slack", "microsoft teams", "asana", "agile", "scrum", "kanban",
    "pair programming", "code review", "project management", "gitflow", "basecamp",
    "monday.com", "clickup", "notion", "taiga", "redmine", "bugzilla", "phabricator",
    "pivotal tracker", "trac", "taiga", "youtrack", "taskwarrior", "todoist", "airtable",

    # Testing & QA
    "unit testing", "integration testing", "functional testing", "end-to-end testing",
    "selenium", "cypress", "pytest", "junit", "mocha", "chai", "jest", "enzyme", 
    "cucumber", "testng", "postman", "test automation", "tdd", "bdd", "load testing",
    "stress testing", "performance testing", "security testing", "api testing",
    "browserstack", "saucelabs", "qtest", "zephyr", "robot framework", "soapui",
    "jmeter", "gatling", "locust", "blazemeter", "loadrunner", "applitools", 
    "k6", "tau", "pact", "xray", "carina", "testcomplete", "rational functional tester",

    # Machine Learning & Data Science
    "machine learning", "deep learning", "data analysis", "data visualization",
    "tensorflow", "keras", "pytorch", "scikit-learn", "numpy", "pandas", "matplotlib",
    "seaborn", "nltk", "opencv", "xgboost", "lightgbm", "catboost", "data mining",
    "big data", "hadoop", "spark", "dask", "hive", "pig", "yolov5", "nlp", 
    "computer vision", "ai", "google gemini", "fetch.ai", "mlops", "dataiku", 
    "mlflow", "kubeflow", "kubernetes for ml", "sagemaker", "azure ml", "databricks", 
    "h2o.ai", "knime", "rapidminer", "vertex ai", "data science notebooks", "jupyter notebooks", 
    "colab", "databricks notebooks", "kaggle", "pyspark", "mahout", "flink", "mllib", 
    "airflow for ml", "dvc", "ml pipelines", "feature engineering", "model deployment", 
    "hyperparameter tuning", "ensemble learning", "reinforcement learning", "neural networks", 
    "graph neural networks", "recommender systems", "ai ethics", "explainable ai", "fairness in ai",

    # Security
    "cybersecurity", "penetration testing", "ethical hacking", "encryption", "ssl/tls",
    "oauth", "saml", "jwt", "firewalls", "ids/ips", "siem", "key management", "zero trust",
    "vulnerability assessment", "security auditing", "sast", "dast", "owasp", "secure coding",
    "threat modeling", "incident response", "forensics", "network security", "cloud security", 
    "application security", "compliance", "gdpr", "hipaa", "pci dss", "iso 27001", "cissp", 
    "oscp", "ceh", "iso 27017", "nist", "soc2", "penetration testing", "metasploit", "nmap", 
    "wireshark", "burp suite", "openvas", "nessus", "cortex xdr", "crowdstrike", "darktrace",
    "splunk phantom", "fortinet", "kali linux", "tenable.io", "snyk", "veracode", "checkmarx",

    # Mobile Development
    "android", "ios", "react native", "flutter", "xamarin", "ionic", "swiftui",
    "objective-c", "kotlin", "java (android)", "dart", "cordova", "firebase", "realm",
    "core data", "rxswift", "rxjava", "native script", "jetpack compose", "android jetpack",
    "workmanager", "room", "lottie", "ml kit", "camera x", "graphql", "realm database",
    "cloud firestore", "rxkotlin", "koin", "dagger", "hilt", "retrofit", "volley", "okhttp",

    # System & Network Administration
    "linux", "unix", "windows server", "networking", "tcp/ip", "dns", "dhcp", "vpn",
    "firewall management", "nginx", "apache", "load balancing", "proxy servers", 
    "bash scripting", "powershell", "zabbix", "nagios", "system monitoring", "ansible", 
    "saltstack", "puppet", "chef", "openvpn", "wireguard", "iptables", "firewalld", "netcat", 
    "tcpdump", "wireshark", "bind", "isc dhcp", "haproxy", "keepalived", "etcd", "consul",
    "openstack", "kvm", "xen", "vmware", "vagrant", "virtualbox", "hyper-v", "docker swarm", 
    "lxc/lxd", "systemd", "cron", "logrotate", "rsync", "nfs", "samba", "iscsi", "glusterfs",
    "ceph", "rancher", "digitalocean", "vultr", "ovh", "terraform", "packer", "vault", "cloud-init",


    # APIs & Web Services
    "rest", "graphql", "soap", "json", "xml", "api development", "swagger", "postman",
    "api testing", "openapi", "grpc", "azure functions", "aws api gateway", "webhooks", 
    "rpc", "thrift", "json-rpc", "restful api", "json api", "oath", "saml", "sso", 
    "jwt", "openid connect", "oauth2", "wsdl", "uddi", "aws lambda", "google cloud functions", 
    "eventbridge", "sns", "sqs", "step functions", "azure logic apps", "service bus", 
    "function as a service", "backend as a service", "headless cms", "contentful", "strapi", 
    "wordpress api", "drupal api", "shopify api", "salesforce api", "stripe api", "paypal api",

    # Data Structures & Algorithms
    "data structures", "algorithms", "sorting algorithms", "search algorithms", "recursion", 
    "dynamic programming", "graph theory", "trees", "hash tables", "linked lists", "arrays", 
    "stacks", "queues", "time complexity", "space complexity", "big-o notation", "greedy algorithms",
    "divide and conquer", "backtracking", "bit manipulation", "heap", "priority queue", "red-black tree",
    "avl tree", "binary search tree", "graph traversal", "bfs", "dfs", "kruskal's algorithm",
    "dijkstra's algorithm", "floyd-warshall", "a* search", "bellman-ford", "dynamic programming", 
    "knapsack problem", "longest common subsequence", "edit distance", "fibonacci sequence",
    "minimum spanning tree", "topological sorting", "trie", "suffix tree", "kmp algorithm", "rabin-karp",
    "boyer-moore", "z algorithm", "manacher's algorithm", "segment tree", "fenwick tree", 
    "monotonic stack", "disjoint set", "union-find", "maximum flow", "ford-fulkerson", "edmonds-karp",
    "push-relabel", "minimum cut", "min-cost max-flow", "graph coloring", "bipartite graph", 
    "network flow", "matching algorithms", "stable matching", "gale-shapley", "linear programming",
    "simplex algorithm", "integer programming", "branch and bound", "greedy algorithms", 
    "approximation algorithms", "online algorithms", "randomized algorithms", "monte carlo method",
    "simulated annealing", "genetic algorithms", "ant colony optimization", "dynamic connectivity",
    "range queries", "interval tree", "lazy propagation", "binary indexed tree", "persistent data structures",
    "functional data structures", "self-adjusting data structures", "skip list", "dancing links",
    "treap", "cartesian tree", "pairing heap", "leftist heap", "binomial heap", "fibonacci heap",

    # Soft Skills & Communication
    "communication", "teamwork", "problem solving", "critical thinking", "time management",
    "adaptability", "attention to detail", "learning agility", "initiative", "collaboration",
    "presentation skills", "technical writing", "documentation", "leadership", "mentorship",
    "empathy", "conflict resolution", "decision making", "negotiation", "emotional intelligence",
    "active listening", "public speaking", "interpersonal skills", "networking", "cultural awareness",
    "inclusivity", "coaching", "feedback", "self-motivation", "stress management", "resilience",
    "flexibility", "growth mindset", "work ethic", "creativity", "innovation", "design thinking",
    "user empathy", "customer focus", "business acumen", "entrepreneurship", "product management",
    "strategic thinking", "goal setting", "project planning", "risk management",
    "prioritization", "resource management", "timeboxing", "work-life balance", "continuous learning",
    "lifelong learning", "personal development", "career development", "mentorship", "team building",
    "collaborative problem solving", "cross-functional collaboration", "remote collaboration",
    "virtual teams", "digital literacy", "tech savviness", "social media", "personal branding",
    "self-discipline", "accountability", "ownership", "trustworthiness", "integrity", "honesty",
    "professionalism", "ethics", "confidentiality", "responsibility", "delegation", "assertiveness",
    "proactivity", "positivity", "mindfulness", "reflection", "self-awareness", "emotional regulation",
    "patience", "tolerance", "humility", "respect", "kindness", "team spirit", "enthusiasm",
    "passion", "energy", "focus", "attention span", "concentration", "detail-oriented", "organization",
    "multitasking", "agility", "adaptability", "learning agility", "grit", "perseverance", "tenacity",
    "determination", "persistence", "dedication", "commitment", "reliability", "dependability", 
    "accountability", "autonomy", "self-reliance", "independence", "self-starter", "entrepreneurial mindset",

    # Miscellaneous / Emerging Skills
    "web accessibility", "ux/ui design", "responsive design", "cross-browser compatibility",
    "automation scripting", "cloud computing", "blockchain basics", "ar/vr", "quantum computing basics",
    "robotics", "edge computing", "tiktok ad campaigns", "web scraping", "chatgpt", "ai-enhanced experiences",
    "microsoft office", "powerpoint", "excel", "web scraping", "figma", "web design", 
    "vertical search model", "multithreading", "google maps api", "ai model training",
    "revenue generation", "advertisement marketing", "web design", "personalized experiences",
    "user experience enhancement", "chatbots", "conversational ai", "voice assistants", "smart home",
    "iot", "smart cities", "edge ai", "computer vision", "deepfake detection", "image recognition",
    "video processing", "speech recognition", "natural language processing", "text-to-speech",
    "speech-to-text", "synthetic data", "data privacy"}

    return skill_set

def default_apps(google_id):
    return ([
    Application(status="Not Applied", name="Akuna Capital", open="Software Engineer Intern - Python", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Jane Street", open="Software Engineer Internship", close="New York, NY", link="", google_id=google_id),
    Application(status="Not Applied", name="Wells Fargo", open="Software Engineering Intern", close="Multiple locations", link="", google_id=google_id),
    Application(status="Not Applied", name="TikTok", open="Mobile Software Engineer Intern - User Relation", close="Los Angeles, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="IXL Learning", open="Software Engineer, Intern", close="San Mateo, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="ATPCO", open="Systems Engineer Intern", close="Remote in USA", link="", google_id=google_id),
    Application(status="Not Applied", name="ATPCO", open="Systems Engineer Intern", close="Dulles, VA", link="", google_id=google_id),
    Application(status="Not Applied", name="Sensata", open="Software Engineer Intern - Summer 2025", close="Attleboro, MA", link="", google_id=google_id),
    Application(status="Not Applied", name="Akuna Capital", open="Quantitative Research Intern - Summer 2025", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Amazon", open="Program Manager Intern", close="Seattle, WA", link="", google_id=google_id),
    Application(status="Not Applied", name="Virtu Financial", open="Internship - Developer", close="NYC", link="", google_id=google_id),
    Application(status="Not Applied", name="ByteDance", open="Software Engineer Intern (AI Platform)", close="San Jose, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Notion", open="Software Engineer Intern, Mobile (Summer 2025)", close="New York, NY", link="", google_id=google_id),
    Application(status="Not Applied", name="Notion", open="Software Engineering Intern (Summer 2025)", close="San Francisco, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Motorola", open="Android Platform Software Engineering Intern - Summer 2025", close="Plantation, FL", link="", google_id=google_id),
    Application(status="Not Applied", name="Motorola", open="Android Platform Software Engineering Intern - Summer 2025", close="Hoffman Estates, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Codeium", open="Software Engineering Intern - Summer 2025", close="Mountain View, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="HPR (Hyannis Port Research)", open="Software Engineering Intern - Summer 2025", close="Needham, MA", link="", google_id=google_id),
    Application(status="Not Applied", name="Sentry", open="Software Engineer Intern - Summer 2025", close="Toronto, ON, Canada", link="", google_id=google_id),
    Application(status="Not Applied", name="Ventas", open="Intern, Software Engineering (Summer 2025)", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Five Rings", open="Software Developer Intern", close="New York", link="", google_id=google_id),
    Application(status="Not Applied", name="Confluent", open="Software Engineering Intern", close="Remote", link="", google_id=google_id),
    Application(status="Not Applied", name="Confluent", open="Software Engineering Intern", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern - 2025", close="Bellevue, WA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern - 2025", close="Mountain View, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern - 2025", close="SF", link="", google_id=google_id),
    Application(status="Not Applied", name="Deloitte", open="Software Engineering Summer Scholar", close="New York, NY", link="", google_id=google_id),
    Application(status="Not Applied", name="Deloitte", open="Software Engineering Summer Scholar", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="Deloitte", open="Software Engineering Summer Scholar", close="San Francisco, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="TikTok", open="Software Engineer Intern (Data-TnS-Eng-Biz Arch)", close="Vancouver, Canada", link="", google_id=google_id),
    Application(status="Not Applied", name="Airwallex", open="Software Engineer Intern Program", close="SF", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern", close="Bellevue, WA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern", close="Mountain View, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Databricks", open="Software Engineering Intern", close="San Francisco, CA", link="", google_id=google_id),
    Application(status="Not Applied", name="Strider Technologies", open="Intelligence Specialist Internship - China Focus", close="Vienna, VA", link="", google_id=google_id),
    Application(status="Not Applied", name="Strider Technologies", open="Intelligence Specialist Internship - China Focus", close="South Jordan, UT", link="", google_id=google_id),
    Application(status="Not Applied", name="Oshkosh", open="Data Engineer Intern - Advanced Analytics", close="Oshkosh, WI", link="", google_id=google_id),
    Application(status="Not Applied", name="Quantiq Partners", open="Software Developer Intern", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="Belvedere Trading", open="Software Engineer Intern - Summer 2025", close="Boulder, CO", link="", google_id=google_id),
    Application(status="Not Applied", name="Belvedere Trading", open="Software Engineer Intern - Summer 2025", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Jump Trading", open="Campus Web Dev / UI Software Engineer – Intern", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Neuralink", open="Software Engineer Intern", close="Austin, TX", link="", google_id=google_id),
    Application(status="Not Applied", name="DV Trading", open="2025 Summer Internship - Algo Trader", close="Chicago, IL", link="", google_id=google_id),
    Application(status="Not Applied", name="Qualcomm", open="Software Engineering Intern", close="San Diego, California", link="", google_id=google_id),
    Application(status="Not Applied", name="Vestmark", open="Software Engineer Intern", close="Wakefield, MA", link="", google_id=google_id),
    Application(status="Not Applied", name="Epic", open="Software Developer Intern", close="Madison, WI", link="", google_id=google_id),
    Application(status="Not Applied", name="Apple", open="Machine Learning Intern", close="United States", link="", google_id=google_id)
])
