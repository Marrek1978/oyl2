import type { MaslowsNeedsType } from "~/types/maslowTypes";

export const MaslowsNeeds: MaslowsNeedsType[] = [
  {
    needName: 'Physiological',
    description: 'These are the basic needs of the human body. They include food, water, warmth, rest, and air.',
    categories: [
      {
        categoryName: "Air",
        criteria: [
          {
            title: "egular Breathing",
            description: "Regular, unlabored breathing without distress."
          },
          {
            title: "Breathing - Physical Activity",
            description: "Ability to engage in physical activities without abnormal breathlessness.",
          },
          {
            title: "Environmental Air Quality",
            description: "Living and working in environments with good air quality, free from pollutants and toxins.",
          },
        ]
      },
      {
        categoryName: "Water",
        criteria: [
          {
            title: "Water",
            description: "Regular consumption of water, leading to adequate hydration.",
          },
          {
            title: "Clear Urine",
            description: "Clear or light-colored urine, indicating proper hydration.",
          },
          {
            title: "Hydrated",
            description: "Absence of physical symptoms of dehydration, such as dry mouth, excessive thirst, or dizziness.",
          }
        ]
      },
      {
        categoryName: "Food",
        criteria: [
          {
            title: "Food Availability",
            description: "Consistent access to and consumption of a variety of nutritious foods.",
          },
          {
            title: "Healthy Weight",
            description: "Maintenance of a healthy body weight and nutrient levels.",
          },
          {
            title: "Nutritional Health",
            description: "Absence of symptoms related to malnutrition or over-nutrition.",
          }
        ]
      },
      {
        categoryName: "Shelter",
        criteria: [
          {
            title: "Secure and Stable Shelter",
            description: "Secure and stable living conditions that provide protection from the elements and environmental hazards.",
          },
          {
            title: "Personal Space and Privacy",
            description: "A sense of privacy and personal space.",
          },
          {
            title: "Healthy Living Conditions",
            description: "Living conditions that support health, including adequate sanitation and ventilation.",
          }
        ]
      },
      {
        categoryName: "Clothing",
        criteria: [

          {
            title: "Warm Clothing",
            description: "Access to and use of appropriate clothing for different weather conditions and social situations.",
          },
          {
            title: "Comfortable Clothing",
            description: "Clothing that protects against environmental hazards and supports physical comfort.",
          },
          {
            title: "Appropriate Clothing",
            description: "A sense of adequacy in meeting social and cultural norms related to dress.",
          }
        ]
      },
      {
        categoryName: "Warmth",
        criteria: [
          {
            title: "Thermal Comfort",
            description: "Ability to maintain a comfortable body temperature in various environments.",
          },
          {
            title: "Access to Heating and Cooling",
            description: "Access to heating in cold weather and cooling in hot weather to prevent extreme discomfort or health risks.",
          },
          {
            title: "Adequate Bedding and Shelter",
            description: "Adequate bedding and shelter that contribute to thermal comfort during sleep.",
          }
        ]
      },
      {
        categoryName: "Sleep",
        criteria: [
          {
            title: "Good Sleep Health",
            description: "Absence of chronic sleep issues such as insomnia, sleep apnea, or excessive daytime sleepiness.",
          },
          {
            title: "Regular Sleep Patterns",
            description: "Regular sleep patterns that provide sufficient rest, typically 7-9 hours per night for most adults.",
          },
          {
            title: "Waking Resteed and Rejuvenated.",
            description: "Waking up feeling rested and rejuvenated.",
          },
        ]
      },
      {
        categoryName: "Sex",
        criteria: [
          {
            title: "Sexual Satisfaction and Release",
            description: "Achieving physical satisfaction and release through sexual activity, which could include sexual intercourse, other sexual activities, or masturbation, leading to a sense of physical well-being.",
          },
          {
            title: "Sexual Comfort and Confidence",
            description: "Feeling physically comfortable and confident in engaging in sexual activities, having an understanding of one's own body and sexual response, and being able to communicate preferences and boundaries regarding physical sexual activity.",
          },
          {
            title: "Sexual Frequency",
            description: "Engaging in sexual activities at a frequency that feels satisfactory and fulfilling for the individual's physical desires, acknowledging that this frequency can vary widely among individuals.",
          },
          {
            title: "Proper Sexual Functioning",
            description: "Not experiencing chronic sexual dysfunctions that significantly impair the ability to engage in and enjoy sexual activity, such as erectile dysfunction, arousal disorders, or other conditions that might hinder sexual satisfaction at the physical level.",
          },
          {
            title: "Sexual Health and Safety",
            description: "Maintaining good sexual health, which includes being free from sexually transmitted infections (STIs) and practicing safe sex to prevent STIs and unwanted pregnancies.",
          },
        ]
      },
    ],
  },
  {
    needName: 'Safety',
    description: 'These needs are about keeping us safe from harm. They include personal security, financial security, health and well-being, and safety nets against accidents and illness.',
    categories: [
      {
        categoryName: 'Personal Security',
        criteria: [
          {
            title: "Physical Safety and Protection",
            description: "Being free from physical violence, abuse, and harassment.",
          },
          {
            title: "Access to Protection Services",
            description: "Having access to law enforcement and emergency services when needed.",
          },
          {
            title: "Feeling Safe",
            description: "Feeling safe in one's home and community.",
          },
        ]
      },
      {
        categoryName: 'Safety Against Accidents and Illness',
        criteria: [
          {
            title: "Safe Environments",
            description: "Living and working in environments that are free from hazards and risks to physical safety.",
          },
          {
            title: "Safety Equipment",
            description: "Having access to safety equipment and resources to prevent accidents and injuries.",
          },
          {
            title: "Secure in living situation",
            description: "Feeling secure in one's living situation and having a plan for emergencies.",
          }
        ]
      },
      {
        categoryName: 'Health and Well-Being',
        criteria: [
          {
            title: "Healthcare Access",
            description: "Access to healthcare services and preventive care.",
          },
          {
            title: "Feeling Healthy",
            description: "Feeling physically and mentally healthy and free from chronic illness.",
          },
          {
            title: "Access to Healhty Resources",
            description: "Having access to resources and information that support overall well-being, such as healthy food, exercise, and mental health support.",
          }
        ]
      },
      {
        categoryName: 'Financial Security',
        criteria: [
          {
            title: "Stable income / budget",
            description: "Having a stable income and the ability to meet basic needs.",
          },

          {
            title: "Emergency Funds",
            description: "Having access to financial resources to address emergencies and unexpected expenses.",
          },
          {
            title: "Job Security",
            description: "Feeling secure in one's job and career prospects.",
          },
        ]
      },
      {
        categoryName: "Consistency and Predictability",
        criteria: [
          {
            title: "Consistent/Predictable Routines",
            description: "Having a stable and predictable routine in daily life.",
          },
          {
            title: "Secure Relationship & Envrionment",
            description: "Feeling secure in one's relationships and social environment.",
          },
          {
            title: "Reliable Access to Resources",
            description: "Having access to reliable and consistent resources, such as food, shelter, and transportation.",
          }
        ]
      },
      {
        categoryName: 'Safety Nets',
        criteria: [
          {
            title: "Insurance and Protections",
            description: "Having insurance and other protections against accidents, illness, and other unexpected events.",
          },
          {
            title: "Emergency Plans",
            description: "Feeling secure in one's living situation and having a plan for emergencies.",
          },
          {
            title: "Access to Social Services",
            description: "Having access to social services and support networks that can provide assistance in times of need.",
          }
        ]
      },
    ],
  },
  {
    needName: 'Love and Belonging',
    description: 'After the first two needs have been satisfied, human beings begin to crave relationships and a sense of belonging.',
    categories: [
      {
        categoryName: 'Sense of Belonging',
        criteria: [
          {
            title: "Feeling Valued",
            description: "Feeling valued and respected by others.",
          },
          {
            title: "Sense of Belonging",
            description: "Having a sense of belonging and acceptance in social groups and communities.",
          },
          {
            title: "Recognition from Others",
            description: "Receiving positive feedback and recognition from others.",
          }
        ]
      },
      {
        categoryName: 'Mutual Support',
        criteria: [
          {
            title: "Camaraderie and Teamwork",
            description: "Having a sense of camaraderie and teamwork in relationships and social groups.",
          },
          {
            title: "Feel Supported",
            description: "Feeling supported and encouraged by others.",
          },
          {
            title: "Receiving Help and Assistance",
            description: "Receiving help and assistance from others when needed.",
          }
        ]
      },
      {
        categoryName: 'Acceptance and Inclusion',
        criteria: [
          {
            title: "Feeling Accepted",
            description: "Feeling accepted and included in social and professional circles.",
          },
          {
            title: "Treated Fairly",
            description: "Being treated with fairness and respect by others.",
          },
          {
            title: "Advancment Opportunities",
            description: "Having opportunities for social and professional advancement.",
          }
        ]
      },
      {
        categoryName: 'Positive Social Interactions',
        criteria: [
          {
            title: "Calm-Confidence",
            description: "Feeling comfortable and confident in social situations.",
          },
          {
            title: "Fulfilling Interactions",
            description: "Having enjoyable and fulfilling interactions with others.",
          },
          {
            title: "Social Opportunities",
            description: "Having opportunities for socializing and connecting with others.",
          }
        ]
      },
      {
        categoryName: 'Emotional Connections',
        criteria: [
          {
            title: "Feeling Connected",
            description: "Feeling connected to others and having a sense of belonging.",
          },
          {
            title: "Close Friendships and Family Ties",
            description: "Having close, supportive relationships with friends and family.",
          },
          {
            title: "Feeling Loved by Others",
            description: "Feeling loved and cared for by others.",
          },
        ]
      },
      {
        categoryName: 'Intimate Relationship',
        criteria: [
          {
            title: "Intimaracy and Connection",
            description: "Having a sense of intimacy and connection with a partner.",
          },
          {
            title: "Feeling Loved and Appreciated",
            description: "Feeling loved and appreciated in romantic relationships.",
          },
          {
            title: "Emotional/Physical Support",
            description: "Receiving emotional and physical support from a partner.",
          }
        ]
      },
    ],
  },
  {
    needName: 'Esteem',
    description: 'Esteem needs are about being respected and successful. These needs include things that reflect self-esteem, personal worth, social recognition, and accomplishment.',
    categories: [
      {
        categoryName: 'Self-Respect',
        criteria: [
          {
            title: "Pride",
            description: "Feeling confident and proud of one's abilities and accomplishments.",
          },
          {
            title: "Positive & Realistic Self-Image",
            description: "Having a positive self-image and a relistic sense of self-worth.",
          },
          {
            title: "Secure Identity",
            description: "Feeling comfortable and secure in one's identity, values, and decisions.",
          }
        ]
      },
      {
        categoryName: 'Confidence',
        criteria: [
          {
            title: "Confidence",
            description: "Exhibiting confidence in one's abilities and in facing new challenges",
          },
          {
            title: "Capable",
            description: "Feeling prepared and cabable of handling life's challenges.",
          },
          {
            title: "Secure in Decisions",
            description: "Feeling secure in one's decisions and actions.",
          },
        ]
      },
      {
        categoryName: 'Independence and Autonomy',
        criteria: [
          {
            title: "Self-Reliance",
            description: "Feeling self-reliant and capable of making independent decisions.",
          },
          {
            title: "Autonomy",
            description: "Having control over one's own life and choices.",
          },
          {
            title: "Freedom",
            description: "Experiencing freedom in personal and professional pursuits.",
          }
        ]
      },
      {
        categoryName: 'Achievement',
        criteria: [
          {
            title: "Achievements",
            description: "Setting and reaching personal and professional goals.",
          },
          {
            title: "Valueing Efforts",
            description: "Valuing one's own efforts and successes.",
          },
          {
            title: "Feeling Successful",
            description: "Feeling successful and accomplished in one's endeavors.",
          },
        ]
      },
      {
        categoryName: 'Competence and Mastery',
        criteria: [
          {
            title: "Development of Skills",
            description: "Developing and using skills and talents to achieve success.",
          },
          {
            title: "Competence",
            description: "Feeling competent and capable in one's professional and personal life.",
          },
          {
            title: "Mastery",
            description: "Mastering new skills and knowledge.",
          }
        ]
      },
    ],
  },
  {
    needName: 'Self-Actualization',
    description: 'This is the highest level of Maslow’s hierarchy of needs. Self-actualizing people are self-aware, concerned with personal growth, less concerned with the opinions of others, and interested in fulfilling their potential.',
    categories: [
      {
        categoryName: 'Acceptance of Self and Others',
        criteria: [
          {
            title: "Acceptance",
            description: "Accepting oneself and others without judgment or criticism.",
          },
          {
            title: "Embracing Strengths and Weaknesses",
            description: "Embracing one's strengths and weaknesses.",
          },
          {
            title: "Valueing Individual Differences",
            description: "Valuing individual differences.",
          }
        ]
      },
      {
        categoryName: 'Personal Growth',
        criteria: [
          {
            title: "Development",
            description: "Pursuing personal and professional development.",
          },
          {
            title: "Self-Improvement",
            description: "Seeking opportunities for learning and self-improvement.",
          },
          {
            title: "Motivated to Grow",
            description: "Feeling motivated to grow and evolve as an individual.",
          }
        ]
      },
      {
        categoryName: 'Authenticity',
        criteria: [
          {
            title: "Alignment",
            description: "Living in alignment with one's true self and values.",
          },
          {
            title: "Honesty",
            description: "Being honest and genuine in interactions with others.",
          },
          {
            title: "Authenticity",
            description: "Feeling comfortable expressing one's true thoughts and emotions.",
          }
        ]
      },
      {
        categoryName: 'Self-Expression',
        criteria: [
          {
            title: "Honest Self-Expression",
            description: "Expressing one's unique identity and individuality.",
          },
          {
            title: "Non-Judgement",
            description: "Feeling free to express thoughts, emotions, and ideas.",
          },
          {
            title: "Pursuing Creative Endeavors",
            description: "Pursuing creative and artistic endeavors.",
          }
        ]
      },
      {
        categoryName: 'Creativity',
        criteria: [
          {
            title: "Creativity",
            description: "Engaging in artistic and intellectual pursuits.",
          },
          {
            title: "Authentic Self-Expression",
            description: "Expressing originality and creativity in one's work and personal pursuits.",
          },
          {
            title: "Autonomous Self-Expression",
            description: "Seeking opportunities for innovative thinking and problem-solving.",
          },
        ],
      },
      {
        categoryName: "Interpersonal Relationships",
        criteria: [
          {
            title: "Supportive Relationships",
            description: "Engaging in supportive and nurturing relationships.",
          },
          {
            title: "Deep Connections",
            description: "Having deep and meaningful connections with others.",
          },
          {
            title: "Empathy",
            description: "Feeling empathy and compassion for others.",
          },
        ]
      },
      {
        categoryName: 'Problem-Solving and Critical Thinking',
        criteria: [
          {
            title: "Engaging with Challenges",
            description: "Approaching challenges with curiosity and a desire to find solutions.",
          },
          {
            title: "Self-Expression as Solutions",
            description: "Using critical thinking skills to analyze and solve problems.",
          },
          {
            title: "Perseverance",
            description: "Feeling confident in one's ability to overcome obstacles.",
          }
        ]
      },
      {
        categoryName: 'Purpose and Meaning',
        criteria: [
          {
            title: "Seeking Meaning",
            description: "Seeking meaning and purpose in life.",
          },
          {
            title: "Spiritual Connection",
            description: "Feeling connected to a greater sense of purpose or spirituality.",
          },
          {
            title: "Total Alignment",
            description: "Engaging in activities that align with one's values and beliefs.",
          }
        ]
      },
      {
        categoryName: 'Fulfillment of Potential',
        criteria: [
          {
            title: "Being of Utility",
            description: "Using one's talents and abilities to the fullest extent.",
          },
          {
            title: "Purpose and Fulfillment",
            description: "Feeling a sense of purpose and fulfillment in life.",
          },
          {
            title: "Opporunities of Honest Self-Expression",
            description: "Seeking opportunities to express creativity and originality.",
          }
        ]
      },
      {
        categoryName: 'Mastery and Competence',
        criteria: [
          {
            title: "Personal Growth",
            description: "Developing and using skills and talents to achieve success.",
          },
          {
            title: "Competence",
            description: "Feeling competent and capable in one's professional and personal life.",
          },
          {
            title: "Mastery",
            description: "Mastering new skills and knowledge.",
          }
        ]
      },
      {
        categoryName: 'Peak Experiences',
        criteria: [
          {
            title: "Unity with the Larger World",
            description: "Seeking out experiences that bring a sense of fulfillment and unity with the larger world.",
          },
          {
            title: "Peak Experiences",
            description: "Experiencing moments of intense joy, creativity, and connection.",
          },
          {
            title: "Transcendence and Awe",
            description: "Feeling a sense of transcendence and awe.",
          },
          {
            title: "Unity with the Larger World",
            description: "Seeking out experiences that bring a sense of fulfillment and unity with the larger world.",
          }
        ]
      },
    ],
  },
];

