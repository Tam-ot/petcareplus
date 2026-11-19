import {
  BlogCategory,
  BlogPostItem,
  BrandValueItem,
  ContactInfoCardItem,
  FaqItem,
  FeaturedServiceItem,
  ProcessStepItem,
  ServiceCategoryItem,
} from '../types';

export const HERO_MEDIA = {
  image: '/src/assets/images/hero_dog_cat_1794822134408.jpg',
  alt: 'Một chú chó Golden Retriever thân thiện và một chú mèo Anh lông ngắn ngồi cạnh nhau trên nền kem ấm',
};

export const ABOUT_MEDIA = {
  image: '/src/assets/images/about_owner_pet_1794822132133.jpg',
  alt: 'Chủ nuôi nhẹ nhàng vuốt ve chú chó Golden Retriever trong không gian phòng khách tràn ngập ánh sáng tự nhiên',
};

export const BLOG_HERO_MEDIA = {
  image: '/src/assets/images/blog_dog_cat_hero_1794822133750.jpg',
  alt: 'Chú chó Golden Retriever và mèo mướp nằm nghỉ ngơi bình yên cạnh nhau trên thảm len màu kem',
};

export const SERVICE_OPTIONS: string[] = [
  'Tư vấn định hướng chăm sóc chó',
  'Tư vấn định hướng chăm sóc mèo',
  'Hỗ trợ xây dựng thói quen và lịch sinh hoạt',
  'Trao đổi quy trình chuẩn bị trước khi sử dụng dịch vụ',
  'Chưa xác định — cần PETCARE PLUS tư vấn thêm',
];

export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  {
    id: 'dog-care',
    title: 'CHĂM SÓC CHÓ',
    description: 'Tìm hiểu các giải pháp chăm sóc phù hợp với nhu cầu của cún cưng.',
    image: '/src/assets/images/service_dog_care_1794822129836.jpg',
    imageAlt: 'Chú chó Shiba Inu ngồi ngoan ngoãn trên thảm đan tự nhiên trong không gian tối giản',
    targetServiceValue: 'Tư vấn định hướng chăm sóc chó',
  },
  {
    id: 'cat-care',
    title: 'CHĂM SÓC MÈO',
    description: 'Khám phá những lựa chọn chăm sóc dành riêng cho mèo.',
    image: '/src/assets/images/service_cat_care_1794822130399.jpg',
    imageAlt: 'Chú mèo Anh lông ngắn màu xám xanh nằm thư giãn trên đệm vải lanh màu kem',
    targetServiceValue: 'Tư vấn định hướng chăm sóc mèo',
  },
  {
    id: 'care-consulting',
    title: 'TƯ VẤN CHĂM SÓC',
    description: 'Hỗ trợ chủ nuôi tìm hiểu và lựa chọn dịch vụ phù hợp.',
    image: '/src/assets/images/service_consultation_care_1794822132029.jpg',
    imageAlt: 'Chủ nuôi ôm ấp và trò chuyện nhẹ nhàng cùng chú mèo mướp bên khung cửa sổ',
    targetServiceValue: 'Hỗ trợ xây dựng thói quen và lịch sinh hoạt',
  },
  {
    id: 'owner-support',
    title: 'HỖ TRỢ CHỦ NUÔI',
    description: 'Cung cấp thông tin rõ ràng trước khi bạn đưa ra quyết định.',
    image: '/src/assets/images/blog_pet_care_home_1794822134079.jpg',
    imageAlt: 'Chú chó Golden Retriever nghỉ ngơi cạnh khăn bông sạch và bát nước gốm trên sàn gỗ sáng',
    targetServiceValue: 'Trao đổi quy trình chuẩn bị trước khi sử dụng dịch vụ',
  },
];

export const FEATURED_SERVICES: FeaturedServiceItem[] = [
  {
    id: 'featured-dog-orientation',
    serviceValue: 'Tư vấn định hướng chăm sóc chó',
    name: 'Định hướng chăm sóc và vệ sinh cho chó theo độ tuổi',
    description:
      'Giải thích chi tiết các yếu tố cần lưu ý về tính cách, độ dài bộ lông, mức độ vận động và tâm lý làm quen của cún cưng trước khi chọn hình thức chăm sóc.',
    processHighlight: 'Minh bạch 4 bước trao đổi thông tin về thói quen ăn uống, sinh hoạt và mức độ nhạy cảm của bé.',
    suitableFor: 'Chó giống nhỏ, trung bình và lớn (từ 3 tháng tuổi trở lên)',
    image: '/src/assets/images/service_dog_care_1794822129836.jpg',
    imageAlt: 'Chú chó Shiba Inu ngồi điềm tĩnh trong không gian chăm sóc yên tĩnh',
  },
  {
    id: 'featured-cat-orientation',
    serviceValue: 'Tư vấn định hướng chăm sóc mèo',
    name: 'Hướng dẫn lựa chọn môi trường chăm sóc êm dịu cho mèo',
    description:
      'Cung cấp thông tin rõ ràng về cách giảm căng thẳng cho mèo khi thay đổi không gian, giúp chủ nuôi chủ động chuẩn bị vật dụng quen thuộc và lịch sinh hoạt phù hợp.',
    processHighlight: 'Ưu tiên đánh giá trước tính cách rụt rè hay dạn dĩ để sắp xếp nhịp độ tiếp xúc nhẹ nhàng.',
    suitableFor: 'Mèo nuôi trong nhà, mèo nhút nhát hoặc mèo cần làm quen môi trường mới',
    image: '/src/assets/images/service_cat_care_1794822130399.jpg',
    imageAlt: 'Chú mèo Anh lông ngắn nằm thoải mái trên nệm vải mềm',
  },
  {
    id: 'featured-process-clarity',
    serviceValue: 'Trao đổi quy trình chuẩn bị trước khi sử dụng dịch vụ',
    name: 'Trao đổi quy trình chuẩn bị và tiếp nhận minh bạch',
    description:
      'Đồng hành cùng chủ nuôi rà soát từng đầu việc trước khi xác nhận dịch vụ: từ kiểm tra thông tin cơ bản, ghi nhận lưu ý riêng đến thống nhất cách cập nhật thông tin.',
    processHighlight: 'Mọi thắc mắc về quy trình thực hiện đều được giải đáp rõ ràng trước khi bạn đưa ra lựa chọn.',
    suitableFor: 'Chủ nuôi lần đầu tìm hiểu dịch vụ hoặc cần so sánh các phương án chăm sóc',
    image: '/src/assets/images/service_consultation_care_1794822132029.jpg',
    imageAlt: 'Chủ nuôi tương tác nhẹ nhàng cùng mèo mướp tại nhà',
  },
];

export const PROCESS_STEPS: ProcessStepItem[] = [
  {
    number: '01',
    title: 'TÌM HIỂU',
    description: 'Khám phá thông tin và các dịch vụ dành cho thú cưng.',
    iconKey: 'search',
  },
  {
    number: '02',
    title: 'LỰA CHỌN',
    description: 'Tìm dịch vụ phù hợp với nhu cầu của bạn.',
    iconKey: 'check',
  },
  {
    number: '03',
    title: 'LIÊN HỆ',
    description: 'Gửi yêu cầu và trao đổi thông tin với PETCARE PLUS.',
    iconKey: 'message',
  },
  {
    number: '04',
    title: 'XÁC NHẬN',
    description: 'Trao đổi rõ ràng về nhu cầu và thông tin dịch vụ trước khi sử dụng.',
    iconKey: 'clipboard',
  },
];

export const BRAND_VALUES: BrandValueItem[] = [
  {
    id: 'clear-info',
    title: 'THÔNG TIN RÕ RÀNG',
    description: 'Nội dung dễ hiểu, giúp chủ nuôi nắm bắt thông tin cần thiết.',
    iconKey: 'book',
  },
  {
    id: 'right-consulting',
    title: 'TƯ VẤN PHÙ HỢP',
    description: 'Hỗ trợ tìm kiếm lựa chọn chăm sóc dựa trên nhu cầu thực tế.',
    iconKey: 'compass',
  },
  {
    id: 'dedicated-companion',
    title: 'ĐỒNG HÀNH TẬN TÂM',
    description: 'Chú trọng trải nghiệm giao tiếp rõ ràng và thân thiện.',
    iconKey: 'heart',
  },
];

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Tất cả bài viết',
  'Chăm sóc chó',
  'Chăm sóc mèo',
  'Kiến thức thú cưng',
  'Tư vấn dịch vụ',
];

export const BLOG_POSTS: BlogPostItem[] = [
  {
    slug: 'chon-dich-vu-phu-hop-cho-thu-cung',
    title: 'Làm thế nào để lựa chọn dịch vụ phù hợp cho thú cưng?',
    category: 'Tư vấn dịch vụ',
    dateLabel: '14/10/2026 (Ngày minh họa)',
    readTime: '5 phút đọc',
    excerpt:
      'Bốn tiêu chí quan trọng giúp chủ nuôi đánh giá tính cách, thói quen sinh hoạt và mức độ sẵn sàng của chó mèo trước khi lựa chọn dịch vụ chăm sóc.',
    image: '/src/assets/images/blog_dog_cat_hero_1794822133750.jpg',
    imageAlt: 'Chó Golden Retriever và mèo mướp nghỉ ngơi bình yên cạnh nhau trong phòng khách sáng tự nhiên',
    featured: true,
    relatedServiceValue: 'Trao đổi quy trình chuẩn bị trước khi sử dụng dịch vụ',
    sections: [
      {
        heading: 'Hiểu rõ tính cách và mức độ nhạy cảm của người bạn nhỏ',
        paragraphs: [
          'Mỗi chú chó hay chú mèo đều có ngưỡng thoải mái khác nhau trước âm thanh, mùi hương lạ hoặc sự xuất hiện của người mới. Việc quan sát phản ứng thường ngày của bé tại nhà là cơ sở quan trọng nhất trước khi tìm kiếm bất kỳ dịch vụ hỗ trợ nào.',
          'Thay vì chọn theo cảm tính hoặc theo xu hướng chung, chủ nuôi nên ghi chú ngắn gọn các đặc điểm như: bé có dễ căng thẳng khi đi xa không, có quen tiếp xúc với các thú cưng khác không, và thời điểm nào trong ngày bé tỉnh táo nhất.',
        ],
      },
      {
        heading: 'Đặt câu hỏi rõ ràng về quy trình tiếp nhận',
        paragraphs: [
          'Sự minh bạch trong bước trao đổi ban đầu giúp bạn giảm đáng kể nỗi lo lắng. Một quy trình rõ ràng sẽ luôn cho phép bạn biết trước các bước chuẩn bị cần thiết, cách ghi nhận thói quen ăn uống hoặc lưu ý đặc biệt của thú cưng.',
        ],
        bullets: [
          'Xác định rõ mục tiêu chăm sóc hiện tại của bạn dành cho thú cưng.',
          'Trao đổi trước các thói quen nhạy cảm (sợ tiếng ồn, kén ăn, nhạy cảm vùng tai hoặc bàn chân).',
          'Chuẩn bị sẵn thông tin cơ bản về độ tuổi, giống loài và lịch sinh hoạt hằng ngày.',
        ],
      },
      {
        heading: 'Bắt đầu từ bước trao đổi thông tin nhẹ nhàng',
        paragraphs: [
          'Nếu bạn vẫn còn phân vân giữa nhiều lựa chọn, hãy bắt đầu bằng một cuộc trao đổi định hướng. Việc chia sẻ cởi mở nhu cầu thực tế sẽ giúp tìm ra phương án phù hợp nhất với cả bạn và thú cưng.',
        ],
      },
    ],
  },
  {
    slug: 'nhung-dieu-can-biet-khi-cham-soc-cho-tai-nha',
    title: 'Những điều cần biết khi chăm sóc chó tại nhà',
    category: 'Chăm sóc chó',
    dateLabel: '10/10/2026 (Ngày minh họa)',
    readTime: '4 phút đọc',
    excerpt:
      'Xây dựng nhịp sinh hoạt ổn định, chải lông định kỳ và quan sát tín hiệu cơ thể để giúp cún cưng luôn thoải mái, gắn kết cùng gia đình.',
    image: '/src/assets/images/blog_pet_care_home_1794822134079.jpg',
    imageAlt: 'Chú chó Golden Retriever nằm thư giãn bên khăn bông sạch và bát nước gốm',
    relatedServiceValue: 'Tư vấn định hướng chăm sóc chó',
    sections: [
      {
        heading: 'Duy trì khung giờ ăn uống và vận động đều đặn',
        paragraphs: [
          'Chó là loài vật yêu thích sự ổn định. Khi bữa ăn, giờ đi dạo và thời gian nghỉ ngơi được giữ tương đối cố định mỗi ngày, hệ tiêu hóa và tâm lý của cún cưng sẽ cân bằng hơn, giảm các biểu hiện bồn chồn hoặc phá phách đồ đạc.',
          'Bên cạnh vận động thể chất ngoài trời, những trò chơi tìm đồ ăn nhẹ nhàng trong nhà cũng giúp kích thích trí não và giữ bé vui vẻ trong những ngày thời tiết thay đổi.',
        ],
      },
      {
        heading: 'Chú ý vệ sinh bộ lông, tai và đệm chân sau khi ra ngoài',
        paragraphs: [
          'Chải lông vài lần mỗi tuần không chỉ giúp hạn chế lông rụng bám trên sofa mà còn là khoảng thời gian tuyệt vời để bạn kiểm tra xem da bé có bị khô, mẩn đỏ hay vướng bụi bẩn sau khi đi dạo hay không.',
        ],
        bullets: [
          'Lau sạch bốn bàn chân bằng khăn ẩm ấm sau mỗi buổi dạo chơi.',
          'Dùng lược phù hợp với độ dài và độ dày lớp lông của từng giống chó.',
          'Luôn giữ bát nước sạch và thay mới ít nhất hai lần mỗi ngày.',
        ],
      },
    ],
  },
  {
    slug: 'cach-xay-dung-thoi-quen-cham-soc-meo',
    title: 'Cách xây dựng thói quen chăm sóc mèo',
    category: 'Chăm sóc mèo',
    dateLabel: '06/10/2026 (Ngày minh họa)',
    readTime: '4 phút đọc',
    excerpt:
      'Mèo rất nhạy cảm với sự thay đổi môi trường. Khám phá cách bố trí góc nghỉ ngơi yên tĩnh, chải lông nhẹ nhàng và duy trì nếp sinh hoạt thân thiện cho mèo.',
    image: '/src/assets/images/service_cat_care_1794822130399.jpg',
    imageAlt: 'Chú mèo Anh lông ngắn nằm thư giãn trên nệm vải lanh màu kem',
    relatedServiceValue: 'Tư vấn định hướng chăm sóc mèo',
    sections: [
      {
        heading: 'Tôn trọng không gian riêng tư và vị trí quan sát của mèo',
        paragraphs: [
          'Khác với chó, mèo thường cảm thấy an toàn hơn khi có một góc cao ráo hoặc một chiếc đệm êm ở nơi ít tiếng ồn để tự quan sát xung quanh. Việc đặt khay vệ sinh, bát ăn và chỗ ngủ tách biệt nhau một khoảng hợp lý sẽ giúp mèo duy trì thói quen sạch sẽ tự nhiên.',
        ],
      },
      {
        heading: 'Biến việc chải lông và vệ sinh thành trải nghiệm dễ chịu',
        paragraphs: [
          'Hãy bắt đầu bằng những buổi chải lông rất ngắn kéo dài 2–3 phút vào lúc mèo đang thư giãn, kết hợp vuốt ve nhẹ vùng má hoặc cằm. Khi mèo không bị ép buộc, bé sẽ dần hợp tác tự nhiên hơn trong các lần chăm sóc tiếp theo.',
        ],
        bullets: [
          'Giữ âm lượng giọng nói nhẹ nhàng khi tiếp xúc và chăm sóc mèo.',
          'Đặt bát nước ở nhiều vị trí yên tĩnh trong nhà để khuyến khích mèo uống đủ nước.',
          'Vệ sinh khay cát hằng ngày để đảm bảo mèo luôn thoải mái sử dụng.',
        ],
      },
    ],
  },
  {
    slug: 'quan-sat-ngon-ngu-co-the-thu-cung',
    title: 'Nhận biết tín hiệu thoải mái và căng thẳng ở chó mèo',
    category: 'Kiến thức thú cưng',
    dateLabel: '01/10/2026 (Ngày minh họa)',
    readTime: '5 phút đọc',
    excerpt:
      'Tai, đuôi, ánh mắt và tư thế nằm tiết lộ rất nhiều về cảm xúc hiện tại của thú cưng. Nắm bắt sớm những dấu hiệu này giúp bạn điều chỉnh cách chăm sóc kịp thời.',
    image: '/src/assets/images/about_owner_pet_1794822132133.jpg',
    imageAlt: 'Chủ nuôi mỉm cười vuốt ve chú chó Golden Retriever trên ghế sofa màu kem',
    relatedServiceValue: 'Hỗ trợ xây dựng thói quen và lịch sinh hoạt',
    sections: [
      {
        heading: 'Những tín hiệu cho thấy thú cưng đang thư giãn',
        paragraphs: [
          'Một chú chó thả lỏng thường có đôi tai tự nhiên, miệng hơi hé nhẹ và phần vai mềm mại. Trong khi đó, một chú mèo an tâm sẽ có ánh mắt dịu, râu hướng tự nhiên sang hai bên và thường thu gọn chân khi nằm nghỉ.',
        ],
      },
      {
        heading: 'Dấu hiệu cần cho bé thêm thời gian thích nghi',
        paragraphs: [
          'Khi thú cưng cụp tai ra sau, liếm môi liên tục dù không ăn, quay mặt đi hoặc thu mình vào góc khuất, đó là lúc bé cần khoảng lặng và sự kiên nhẫn thay vì tiếp xúc dồn dập.',
        ],
        bullets: [
          'Giảm tác nhân gây ồn xung quanh khi bé có dấu hiệu né tránh.',
          'Cho bé tự chủ động tiến lại gần làm quen theo tốc độ của riêng mình.',
          'Ghi nhận lại các tình huống khiến bé hồi hộp để chia sẻ khi cần tư vấn chăm sóc.',
        ],
      },
    ],
  },
  {
    slug: 'chuan-bi-truoc-khi-cho-shiba-inu-lam-quen-moi-truong-moi',
    title: 'Giúp những giống chó giàu cá tính làm quen với quy trình chăm sóc mới',
    category: 'Chăm sóc chó',
    dateLabel: '26/09/2026 (Ngày minh họa)',
    readTime: '4 phút đọc',
    excerpt:
      'Với các giống chó độc lập và nhạy bén như Shiba Inu, sự kiên nhẫn và trao đổi rõ ràng trước khi tiếp cận đóng vai trò quyết định sự hợp tác của bé.',
    image: '/src/assets/images/service_dog_care_1794822129836.jpg',
    imageAlt: 'Chú chó Shiba Inu ngồi điềm tĩnh trên thảm tròn trong căn phòng tràn ánh sáng',
    relatedServiceValue: 'Tư vấn định hướng chăm sóc chó',
    sections: [
      {
        heading: 'Hiểu đúng nét tính cách độc lập của cún cưng',
        paragraphs: [
          'Nhiều giống chó thông minh có ranh giới cá nhân khá rõ rệt, đặc biệt khi người lạ chạm vào bàn chân hoặc vùng đầu đột ngột. Chủ nuôi có thể tập thói quen chạm nhẹ nhàng kết hợp khen ngợi ngay tại nhà từ sớm.',
        ],
      },
      {
        heading: 'Chia sẻ thông tin trước giúp buổi làm quen diễn ra suôn sẻ',
        paragraphs: [
          'Trước khi sử dụng dịch vụ, việc thông báo trước các món đồ chơi yêu thích hoặc thói quen riêng của bé sẽ giúp quá trình tiếp xúc diễn ra tự nhiên, tôn trọng nhịp điệu của thú cưng.',
        ],
      },
    ],
  },
  {
    slug: 'dong-hanh-cung-meo-trong-nhung-ngay-chuyen-giao-thoi-tiet',
    title: 'Chăm sóc tinh thần và giấc ngủ cho mèo khi thời tiết thay đổi',
    category: 'Kiến thức thú cưng',
    dateLabel: '20/09/2026 (Ngày minh họa)',
    readTime: '3 phút đọc',
    excerpt:
      'Cách giữ không gian thông thoáng, ấm áp và duy trì tương tác nhẹ nhàng mỗi ngày để mèo giữ được nếp sinh hoạt ổn định quanh năm.',
    image: '/src/assets/images/service_consultation_care_1794822132029.jpg',
    imageAlt: 'Chủ nuôi nhẹ nhàng ôm chú mèo mướp gần cửa sổ nhiều ánh sáng tự nhiên',
    relatedServiceValue: 'Tư vấn định hướng chăm sóc mèo',
    sections: [
      {
        heading: 'Tối ưu ánh sáng tự nhiên và chỗ nằm êm ái',
        paragraphs: [
          'Mèo rất thích sưởi ấm nhẹ bên khung cửa sổ có rèm che dịu mắt vào buổi sáng. Việc thay vỏ đệm định kỳ bằng chất liệu vải cotton hoặc lanh thoáng khí giúp hạn chế bám lông và giữ chỗ ngủ luôn dễ chịu.',
        ],
      },
      {
        heading: 'Tương tác đều đặn nhưng không làm gián đoạn giấc ngủ',
        paragraphs: [
          'Dành khoảng 10–15 phút chơi tương tác nhẹ nhàng vào buổi tối trước bữa ăn giúp mèo giải tỏa năng lượng dư thừa và ngủ sâu hơn vào ban đêm.',
        ],
      },
    ],
  },
];

export const CONTACT_INFO_CARDS: ContactInfoCardItem[] = [
  {
    id: 'email',
    label: 'Email liên hệ',
    value: 'lienhe@petcareplus.example',
    note: 'Địa chỉ email minh họa cho dự án giáo dục',
    iconKey: 'mail',
  },
  {
    id: 'phone',
    label: 'Điện thoại hỗ trợ',
    value: '(000) 000-0000',
    note: 'Số điện thoại mẫu (không phải số thực tế)',
    iconKey: 'phone',
  },
  {
    id: 'hours',
    label: 'Thời gian hỗ trợ',
    value: 'Thứ 2 – Chủ nhật · 08:30 – 18:00',
    note: 'Khung giờ tiếp nhận tư vấn tham khảo',
    iconKey: 'clock',
  },
  {
    id: 'social',
    label: 'Mạng xã hội',
    value: '@petcareplus.edu',
    note: 'Kênh cộng đồng minh họa (Facebook / Instagram)',
    iconKey: 'share',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-services',
    question: 'PETCARE PLUS cung cấp những dịch vụ nào?',
    answer:
      'PETCARE PLUS tập trung vào bốn nhóm nội dung hỗ trợ chính: định hướng chăm sóc dành riêng cho chó, định hướng chăm sóc dành riêng cho mèo, tư vấn xây dựng thói quen chăm sóc phù hợp với từng cá thể thú cưng và hỗ trợ cung cấp thông tin minh bạch để chủ nuôi an tâm trước khi lựa chọn.',
  },
  {
    id: 'faq-choose',
    question: 'Làm thế nào để lựa chọn dịch vụ phù hợp?',
    answer:
      'Bạn có thể bắt đầu bằng việc xem qua danh mục dịch vụ dành cho chó hoặc mèo trên Trang chủ, đọc thêm các bài chia sẻ trong mục Blog để hiểu rõ nhu cầu thực tế của thú cưng, sau đó gửi yêu cầu qua trang Liên hệ để được trao đổi chi tiết dựa trên độ tuổi, giống loài và tính cách của bé.',
  },
  {
    id: 'faq-consult-before',
    question: 'Tôi có thể liên hệ tư vấn trước khi sử dụng dịch vụ không?',
    answer:
      'Hoàn toàn được. PETCARE PLUS khuyến khích chủ nuôi trao đổi trước mọi thắc mắc về thói quen sinh hoạt, mức độ nhạy cảm của thú cưng và quy trình chuẩn bị. Việc tìm hiểu rõ ràng ngay từ đầu giúp cả bạn và thú cưng có trải nghiệm thoải mái nhất.',
  },
  {
    id: 'faq-how-to-send',
    question: 'Làm thế nào để gửi yêu cầu tư vấn?',
    answer:
      'Bạn chỉ cần điền đầy đủ thông tin vào biểu mẫu ngay trên trang Liên hệ (họ tên, email, số điện thoại, loại thú cưng, dịch vụ quan tâm và nội dung cần trao đổi) rồi nhấn nút "Gửi yêu cầu tư vấn". Nếu bạn đi từ thẻ dịch vụ ở Trang chủ, dịch vụ quan tâm sẽ được chọn sẵn giúp tiết kiệm thời gian.',
  },
];
