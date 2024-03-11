
// [
//   {
//     name:string
//     description:string
//     subNeeds: [
//       {
//         name:string
//         criteria: string[]
//       }
//     ]
//   }
// ] 


export const MaslowsNeeds = [
  {
    name: 'Physiological',
    description: 'These are the basic needs of the human body. They include food, water, warmth, rest, and air.',
    subNeeds: [
      {
        name: "Air",
        criteria: [
          "Regular, unlabored breathing without distress.",
          "Ability to engage in physical activities without abnormal breathlessness.",
          "Living and working in environments with good air quality, free from pollutants and toxins.",
        ]
      },
      {
        name: "Water",
        criteria: [
          "	Regular consumption of water, leading to adequate hydration.",
          "	Clear or light-colored urine, indicating proper hydration.",
          "	Absence of physical symptoms of dehydration, such as dry mouth, excessive thirst, or dizziness.",
        ]
      },
      {
        name: "Food",
        criteria: [
          "	Consistent access to and consumption of a variety of nutritious foods.",
          "	Maintenance of a healthy body weight and nutrient levels.",
          "	Absence of symptoms related to malnutrition or over-nutrition.",
        ]
      },
      {
        name: "Shelter",
        criteria: [
          "Secure and stable living conditions that provide protection from the elements and environmental hazards.",
          "A sense of privacy and personal space.",
          "Living conditions that support health, including adequate sanitation and ventilation.",
        ]
      },
      {
        name: "Clothing",
        criteria: [
          "Access to and use of appropriate clothing for different weather conditions and social situations.",
          "Clothing that protects against environmental hazards and supports physical comfort.",
          "A sense of adequacy in meeting social and cultural norms related to dress.",
        ]
      },
      {
        name: "Warmth",
        criteria: [
          "Ability to maintain a comfortable body temperature in various environments.",
          "Access to heating in cold weather and cooling in hot weather to prevent extreme discomfort or health risks.",
          "Adequate bedding and shelter that contribute to thermal comfort during sleep.",
        ]
      },
      {
        name: "Sleep",
        criteria: [
          "Regular sleep patterns that provide sufficient rest, typically 7-9 hours per night for most adults.",
          "Waking up feeling rested and rejuvenated.",
          "Absence of chronic sleep issues such as insomnia, sleep apnea, or excessive daytime sleepiness.",
        ]
      },
      {
        name: "Sex",
        criteria: [
          "Achieving physical satisfaction and release through sexual activity, which could include sexual intercourse, other sexual activities, or masturbation, leading to a sense of physical well-being.",
          "Engaging in sexual activities at a frequency that feels satisfactory and fulfilling for the individual's physical desires, acknowledging that this frequency can vary widely among individuals.",
          "Not experiencing chronic sexual dysfunctions that significantly impair the ability to engage in and enjoy sexual activity, such as erectile dysfunction, arousal disorders, or other conditions that might hinder sexual satisfaction at the physical level.",
          "Maintaining good sexual health, which includes being free from sexually transmitted infections (STIs) and practicing safe sex to prevent STIs and unwanted pregnancies.",
          "Feeling physically comfortable and confident in engaging in sexual activities, having an understanding of one's own body and sexual response, and being able to communicate preferences and boundaries regarding physical sexual activity.",
        ]
      },
    ],
  },
  {
    name: 'Safety',
    description: 'These needs are about keeping us safe from harm. They include personal security, financial security, health and well-being, and safety nets against accidents and illness.',
    subNeeds: [
      {
        name: 'Personal Security',
        criteria: [
          "Feeling safe in one's home and community.",
          "Being free from physical violence, abuse, and harassment.",
          "Having access to law enforcement and emergency services when needed.",
        ]
      },
      {
        name: 'Financial Security',
        criteria: [
          "Having a stable income and the ability to meet basic needs.",
          "Feeling secure in one's job and career prospects.",
          "Having access to financial resources to address emergencies and unexpected expenses.",
        ]
      },
      {
        name: 'Health and Well-Being',
        criteria: [
          "Access to healthcare services and preventive care.",
          "Feeling physically and mentally healthy and free from chronic illness.",
          "Having access to resources and information that support overall well-being, such as healthy food, exercise, and mental health support.",
        ]
      },
      {
        name: 'Safety Nets',
        criteria: [
          "Having insurance and other protections against accidents, illness, and other unexpected events.",
          "Feeling secure in one's living situation and having a plan for emergencies.",
          "Having access to social services and support networks that can provide assistance in times of need.",
        ]
      },
      {
        name: 'Safety Against Accidents and Illness',
        criteria: [
          "Living and working in environments that are free from hazards and risks to physical safety.",
          "Having access to safety equipment and resources to prevent accidents and injuries.",
          "Feeling secure in one's living situation and having a plan for emergencies.",
        ]
      },
      {
        name: "Consistency and Predictability",
        criteria: [
          "Having a stable and predictable routine in daily life.",
          "Feeling secure in one's relationships and social environment.",
          "Having access to reliable and consistent resources, such as food, shelter, and transportation.",
        ]
      },
    ],
  },
  {
    name: 'Love and Belonging',
    description: 'After the first two needs have been satisfied, human beings begin to crave relationships and a sense of belonging.',
    subNeeds: [
      {
        name: 'Emotional Connections',
        criteria: [
          "Feeling loved and cared for by others.",
          "Having close, supportive relationships with friends and family.",
          "Feeling connected to others and having a sense of belonging.",
        ]
      },
      {
        name: 'Sense of Belonging',
        criteria: [
          "Feeling valued and respected by others.",
          "Having a sense of belonging and acceptance in social groups and communities.",
          "Receiving positive feedback and recognition from others.",
        ]
      },
      {
        name: 'Mutual Support',
        criteria: [
          "Feeling supported and encouraged by others.",
          "Having a sense of camaraderie and teamwork in relationships and social groups.",
          "Receiving help and assistance from others when needed.",
        ]
      },
      {
        name: 'Acceptance and Inclusion',
        criteria: [
          "Feeling accepted and included in social and professional circles.",
          "Being treated with fairness and respect by others.",
          "Having opportunities for social and professional advancement.",
        ]
      },
      {
        name: 'Intimate Relationship',
        criteria: [
          "Feeling loved and appreciated in romantic relationships.",
          "Having a sense of intimacy and connection with a partner.",
          "Receiving emotional and physical support from a partner.",
        ]
      },
      {
        name: 'Positive Social Interactions',
        criteria: [
          "Having enjoyable and fulfilling interactions with others.",
          "Feeling comfortable and confident in social situations.",
          "Having opportunities for socializing and connecting with others.",
        ]
      },
    ],
  },
  {
    name: 'Esteem',
    description: 'Esteem needs are about being respected and successful. These needs include things that reflect self-esteem, personal worth, social recognition, and accomplishment.',
    subNeeds: [
      {
        name: 'Self-Respect',
        criteria: [
          "Feeling confident and proud of one's abilities and accomplishments.",
          "Having a positive self-image and a relistic sense of self-worth.",
          "Feeling comfortable and secure in one's identity, values, and decisions.",
        ]
      },
      {
        name: 'Achievement',
        criteria: [
          "Setting and reaching personal and professional goals.",
          "Feeling successful and accomplished in one's endeavors.",
          "Valuing one's own efforts and successes.",
        ]
      },
      {
        name: 'Confidence',
        criteria: [
          "Exhibiting confidence in one's abilities and in facing new challenges",
          "Feeling secure in one's decisions and actions.",
          "Feeling prepared and cabable of handling life's challenges.",
        ]
      },
      {
        name: 'Competence and Mastery',
        criteria: [
          "Developing and using skills and talents to achieve success.",
          "Feeling competent and capable in one's professional and personal life.",
          "Mastering new skills and knowledge.",
        ]
      },
      {
        name: 'Independence and Autonomy',
        criteria: [
          "Feeling self-reliant and capable of making independent decisions.",
          "Having control over one's own life and choices.",
          "Experiencing freedom and autonomy in personal and professional pursuits.",
        ]
      },
    ],
  },
  {
    name: 'Self-Actualization',
    description: 'This is the highest level of Maslow’s hierarchy of needs. Self-actualizing people are self-aware, concerned with personal growth, less concerned with the opinions of others, and interested in fulfilling their potential.',
    subNeeds: [
      {
        name: 'Personal Growth',
        criteria: [
          "Pursuing personal and professional development.",
          "Seeking opportunities for learning and self-improvement.",
          "Feeling motivated to grow and evolve as an individual.",
        ]
      },
      {
        name: 'Creativity',
        criteria: [
          "Expressing originality and creativity in one's work and personal pursuits.",
          "Seeking opportunities for innovative thinking and problem-solving.",
          "Engaging in artistic and intellectual pursuits.",
        ],
      },
      {
        name: 'Authenticity',
        criteria: [
          "Living in alignment with one's true self and values.",
          "Being honest and genuine in interactions with others.",
          "Feeling comfortable expressing one's true thoughts and emotions.",
        ]
      },
      {
        name: 'Problem-Solving and Critical Thinking',
        criteria: [
          "Approaching challenges with curiosity and a desire to find solutions.",
          "Using critical thinking skills to analyze and solve problems.",
          "Feeling confident in one's ability to overcome obstacles.",
        ]
      },
      {
        name: 'Purpose and Meaning',
        criteria: [
          "Seeking meaning and purpose in life.",
          "Feeling connected to a greater sense of purpose or spirituality.",
          "Engaging in activities that align with one's values and beliefs.",
        ]
      },
      {
        name: 'Peak Experiences',
        criteria: [
          "Experiencing moments of intense joy, creativity, and connection.",
          "Feeling a sense of transcendence and awe.",
          "Seeking out experiences that bring a sense of fulfillment and unity with the larger world.",
        ]
      },
      {
        name: 'Acceptance of Self and Others',
        criteria: [
          "Accepting oneself and others without judgment or criticism.",
          "Embracing one's strengths and weaknesses.",
          "Valuing individual differences.",
        ]
      },
      {
        name: "Interpersonal Relationships",
        criteria: [
          "Having deep and meaningful connections with others.",
          "Feeling empathy and compassion for others.",
          "Engaging in supportive and nurturing relationships.",
        ]
      },
      {
        name: 'Mastery and Competence',
        criteria: [
          "Developing and using skills and talents to achieve success.",
          "Feeling competent and capable in one's professional and personal life.",
          "Mastering new skills and knowledge.",
        ]
      },

      {
        name: 'Fulfillment of Potential',
        criteria: [
          "Using one's talents and abilities to the fullest extent.",
          "Feeling a sense of purpose and fulfillment in life.",
          "Seeking opportunities to express creativity and originality.",
        ]
      },
      {
        name: 'Self-Expression',
        criteria: [
          "Expressing one's unique identity and individuality.",
          "Feeling free to express thoughts, emotions, and ideas.",
          "Pursuing creative and artistic endeavors.",
        ]
      },

    ],
  },
];

