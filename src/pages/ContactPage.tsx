import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  Phone,
  Share2,
} from 'lucide-react';
import {
  CONTACT_INFO_CARDS,
  FAQ_ITEMS,
  SERVICE_OPTIONS,
} from '../data/petcareData';
import { ContactFormValues, PetTypeOption } from '../types';

interface ContactPageProps {
  preselectedService: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

const PET_TYPES: PetTypeOption[] = ['Chó', 'Mèo', 'Khác'];

export const ContactPage: React.FC<ContactPageProps> = ({
  preselectedService,
}) => {
  const [formValues, setFormValues] = useState<ContactFormValues>({
    fullName: '',
    email: '',
    phone: '',
    petType: 'Chó',
    service: preselectedService || SERVICE_OPTIONS[0],
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedRecord, setSubmittedRecord] =
    useState<ContactFormValues | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  // Sync automatically whenever user clicks a service CTA or header button
  useEffect(() => {
    if (preselectedService) {
      setFormValues((prev) => ({
        ...prev,
        service: preselectedService,
        petType: preselectedService.toLowerCase().includes('mèo')
          ? 'Mèo'
          : preselectedService.toLowerCase().includes('chó')
          ? 'Chó'
          : prev.petType,
      }));
      setSubmittedRecord(null);
    }
  }, [preselectedService]);

  const renderInfoIcon = (key: 'mail' | 'phone' | 'clock' | 'share') => {
    const props = { className: 'h-5 w-5 text-[#233B53]', 'aria-hidden': true as const };
    switch (key) {
      case 'mail':
        return <Mail {...props} />;
      case 'phone':
        return <Phone {...props} />;
      case 'clock':
        return <Clock {...props} />;
      case 'share':
        return <Share2 {...props} />;
    }
  };

  const validateForm = (values: ContactFormValues): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên của bạn.';
    } else if (values.fullName.trim().length < 2) {
      nextErrors.fullName = 'Họ và tên cần có ít nhất 2 ký tự.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(values.email.trim())) {
      nextErrors.email =
        'Địa chỉ email chưa đúng định dạng (ví dụ: ten@email.com).';
    }

    const cleanedPhone = values.phone.replace(/[\s\-().+]/g, '');
    if (!values.phone.trim()) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại liên hệ.';
    } else if (!/^\d{8,15}$/.test(cleanedPhone)) {
      nextErrors.phone =
        'Số điện thoại cần chứa từ 8 đến 15 chữ số hợp lệ.';
    }

    if (!values.service) {
      nextErrors.service = 'Vui lòng chọn dịch vụ bạn quan tâm.';
    }

    if (!values.message.trim()) {
      nextErrors.message = 'Vui lòng nhập nội dung cần tư vấn.';
    } else if (values.message.trim().length < 10) {
      nextErrors.message =
        'Vui lòng chia sẻ thêm thông tin (tối thiểu 10 ký tự) để chúng tôi hiểu rõ nhu cầu của thú cưng.';
    }

    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmittedRecord({ ...formValues });
    }
  };

  const handleResetAfterSubmit = () => {
    setSubmittedRecord(null);
    setErrors({});
    setFormValues({
      fullName: '',
      email: '',
      phone: '',
      petType: 'Chó',
      service: preselectedService || SERVICE_OPTIONS[0],
      message: '',
    });
  };

  const handleFieldChange = <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      {/* Contact Hero */}
      <section className="bg-[#F5F1E8] py-12 sm:py-16 lg:py-22">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="max-w-3xl">
            <p className="text-[15px] font-semibold text-[#233B53]/80 sm:text-base">
              Liên hệ &amp; Tư vấn dịch vụ
            </p>
            <div aria-hidden="true" className="mt-2 h-0.5 w-10 rounded-full bg-[#E99A78]" />
            <h1 className="mt-3.5 font-[var(--font-display)] text-[clamp(2.2rem,3.8vw,3.35rem)] font-bold leading-[1.15] tracking-tight text-[#233B53]">
              Chúng tôi luôn sẵn sàng lắng nghe
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#332C28]/85 sm:text-xl">
              Hãy chia sẻ nhu cầu của bạn để PETCARE PLUS có thể hỗ trợ tìm hiểu dịch vụ phù hợp.
            </p>
          </div>

          {/* 4 Placeholder Contact Info Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-7">
            {CONTACT_INFO_CARDS.map((card) => (
              <div
                key={card.id}
                className="rounded-[22px] border border-[#233B53]/10 bg-white p-6"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F1E8]">
                  {renderInfoIcon(card.iconKey)}
                </div>
                <p className="mt-4 text-[13px] font-semibold text-[#233B53]/75">
                  {card.label}
                </p>
                <p className="mt-1 font-[var(--font-display)] text-base font-bold text-[#233B53]">
                  {card.value}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#332C28]/70">
                  {card.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="consultation-form" className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left guidance */}
            <div className="lg:col-span-5">
              <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl">
                Gửi thông tin cần tư vấn
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#332C28]/80 sm:text-lg">
                Điền biểu mẫu bên cạnh để chia sẻ về giống loài, tính cách hoặc những điều bạn còn băn khoăn. PETCARE PLUS sẽ giúp bạn nắm rõ các bước chuẩn bị trước khi quyết định.
              </p>

              <div className="mt-8 space-y-4 rounded-[22px] bg-[#F5F1E8] p-7">
                <h3 className="font-[var(--font-display)] text-lg font-bold text-[#233B53]">
                  Gợi ý nội dung nên chia sẻ
                </h3>
                <ul className="space-y-3 text-[15px] leading-relaxed text-[#332C28]/85 sm:text-base">
                  <li className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E99A78]"
                    />
                    <span>Độ tuổi, giống loài và thói quen hằng ngày của bé.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E99A78]"
                    />
                    <span>Những điểm nhạy cảm (sợ tiếng ồn, nhút nhát với người lạ).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E99A78]"
                    />
                    <span>Những câu hỏi bạn muốn được giải đáp rõ trước khi chọn dịch vụ.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right interactive form */}
            <div className="lg:col-span-7">
              <div className="rounded-[24px] border border-[#233B53]/10 bg-[#F5F1E8]/45 p-6 sm:p-8">
                {submittedRecord ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="space-y-6 rounded-[18px] bg-white p-6 sm:p-8"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E99A78]/20 text-[#233B53]">
                        <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-[var(--font-display)] text-xl font-bold text-[#233B53]">
                          Yêu cầu tư vấn đã được ghi nhận
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#332C28]/80">
                          Cảm ơn <span className="font-semibold text-[#233B53]">{submittedRecord.fullName}</span> đã chia sẻ thông tin với PETCARE PLUS. Đây là xác nhận mô phỏng cho website dự án giáo dục.
                        </p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-1 gap-4 border-t border-[#233B53]/10 pt-5 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-[#332C28]/65">Email</dt>
                        <dd className="mt-0.5 font-medium text-[#233B53]">
                          {submittedRecord.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#332C28]/65">Số điện thoại</dt>
                        <dd className="mt-0.5 font-medium tabular-nums text-[#233B53]">
                          {submittedRecord.phone}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#332C28]/65">Thú cưng của bạn</dt>
                        <dd className="mt-0.5 font-medium text-[#233B53]">
                          {submittedRecord.petType}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#332C28]/65">Dịch vụ quan tâm</dt>
                        <dd className="mt-0.5 font-medium text-[#233B53]">
                          {submittedRecord.service}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-[#332C28]/65">Nội dung cần tư vấn</dt>
                        <dd className="mt-1 leading-relaxed text-[#332C28]/85">
                          {submittedRecord.message}
                        </dd>
                      </div>
                    </dl>

                    <div>
                      <button
                        type="button"
                        onClick={handleResetAfterSubmit}
                        className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-[#233B53]/20 bg-[#F5F1E8] px-6 py-2.5 text-sm font-semibold text-[#233B53] transition-colors hover:bg-[#EAE2D3]"
                      >
                        Gửi yêu cầu tư vấn khác
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Họ và tên */}
                    <div>
                      <label
                        htmlFor="contact-fullname"
                        className="block text-sm font-semibold text-[#233B53]"
                      >
                        Họ và tên <span className="text-[#E99A78]">*</span>
                      </label>
                      <input
                        id="contact-fullname"
                        type="text"
                        value={formValues.fullName}
                        onChange={(e) =>
                          handleFieldChange('fullName', e.target.value)
                        }
                        placeholder="Nhập họ và tên của bạn"
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={
                          errors.fullName ? 'error-fullname' : undefined
                        }
                        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#332C28] placeholder:text-[#332C28]/45 focus:outline-2 focus:outline-[#233B53] ${
                          errors.fullName
                            ? 'border-[#C25438]'
                            : 'border-[#233B53]/15'
                        }`}
                      />
                      {errors.fullName && (
                        <p
                          id="error-fullname"
                          role="alert"
                          className="mt-1.5 text-xs font-medium text-[#B34026]"
                        >
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email & Số điện thoại */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-semibold text-[#233B53]"
                        >
                          Email <span className="text-[#E99A78]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={formValues.email}
                          onChange={(e) =>
                            handleFieldChange('email', e.target.value)
                          }
                          placeholder="ten@email.com"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={
                            errors.email ? 'error-email' : undefined
                          }
                          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#332C28] placeholder:text-[#332C28]/45 focus:outline-2 focus:outline-[#233B53] ${
                            errors.email
                              ? 'border-[#C25438]'
                              : 'border-[#233B53]/15'
                          }`}
                        />
                        {errors.email && (
                          <p
                            id="error-email"
                            role="alert"
                            className="mt-1.5 text-xs font-medium text-[#B34026]"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-sm font-semibold text-[#233B53]"
                        >
                          Số điện thoại <span className="text-[#E99A78]">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={formValues.phone}
                          onChange={(e) =>
                            handleFieldChange('phone', e.target.value)
                          }
                          placeholder="Ví dụ: 0901234567"
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={
                            errors.phone ? 'error-phone' : undefined
                          }
                          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm tabular-nums text-[#332C28] placeholder:text-[#332C28]/45 focus:outline-2 focus:outline-[#233B53] ${
                            errors.phone
                              ? 'border-[#C25438]'
                              : 'border-[#233B53]/15'
                          }`}
                        />
                        {errors.phone && (
                          <p
                            id="error-phone"
                            role="alert"
                            className="mt-1.5 text-xs font-medium text-[#B34026]"
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Thú cưng của bạn */}
                    <fieldset>
                      <legend className="text-sm font-semibold text-[#233B53]">
                        Thú cưng của bạn
                      </legend>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {PET_TYPES.map((pet) => {
                          const isSelected = formValues.petType === pet;
                          return (
                            <button
                              key={pet}
                              type="button"
                              onClick={() => handleFieldChange('petType', pet)}
                              aria-pressed={isSelected}
                              className={`min-h-[44px] cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53] ${
                                isSelected
                                  ? 'border-[#233B53] bg-[#233B53] text-white'
                                  : 'border-[#233B53]/15 bg-white text-[#332C28] hover:border-[#233B53]/40'
                              }`}
                            >
                              {pet}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* Dịch vụ quan tâm */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label
                          htmlFor="contact-service"
                          className="block text-sm font-semibold text-[#233B53]"
                        >
                          Dịch vụ quan tâm <span className="text-[#E99A78]">*</span>
                        </label>
                        {preselectedService &&
                          formValues.service === preselectedService && (
                            <span className="text-xs font-semibold text-[#233B53]/80">
                              Đã chọn sẵn theo mục bạn vừa xem
                            </span>
                          )}
                      </div>
                      <select
                        id="contact-service"
                        value={formValues.service}
                        onChange={(e) =>
                          handleFieldChange('service', e.target.value)
                        }
                        aria-invalid={Boolean(errors.service)}
                        aria-describedby={
                          errors.service ? 'error-service' : undefined
                        }
                        className={`mt-2 w-full cursor-pointer rounded-xl border bg-white px-4 py-3 text-sm text-[#332C28] focus:outline-2 focus:outline-[#233B53] ${
                          errors.service
                            ? 'border-[#C25438]'
                            : 'border-[#233B53]/15'
                        }`}
                      >
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p
                          id="error-service"
                          role="alert"
                          className="mt-1.5 text-xs font-medium text-[#B34026]"
                        >
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Nội dung cần tư vấn */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-semibold text-[#233B53]"
                      >
                        Nội dung cần tư vấn{' '}
                        <span className="text-[#E99A78]">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={formValues.message}
                        onChange={(e) =>
                          handleFieldChange('message', e.target.value)
                        }
                        placeholder="Chia sẻ độ tuổi, tính cách hoặc câu hỏi bạn muốn PETCARE PLUS giải đáp..."
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={
                          errors.message ? 'error-message' : undefined
                        }
                        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#332C28] placeholder:text-[#332C28]/45 focus:outline-2 focus:outline-[#233B53] ${
                          errors.message
                            ? 'border-[#C25438]'
                            : 'border-[#233B53]/15'
                        }`}
                      />
                      {errors.message && (
                        <p
                          id="error-message"
                          role="alert"
                          className="mt-1.5 text-xs font-medium text-[#B34026]"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-xl bg-[#233B53] px-7 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1A2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53] sm:w-auto"
                      >
                        Gửi yêu cầu tư vấn
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#F5F1E8] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-[15px] font-semibold text-[#233B53]/80 sm:text-base">
              Giải đáp nhanh
            </p>
            <div aria-hidden="true" className="mx-auto mt-2 h-0.5 w-10 rounded-full bg-[#E99A78]" />
            <h2 className="mt-2.5 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[#233B53] sm:text-4xl">
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="mt-10 space-y-3.5">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const panelId = `${faq.id}-panel`;
              const buttonId = `${faq.id}-button`;

              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-[18px] border border-[#233B53]/10 bg-white"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenFaqId((prev) => (prev === faq.id ? null : faq.id))
                      }
                      className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left font-[var(--font-display)] text-base font-semibold text-[#233B53] transition-colors hover:bg-[#F5F1E8]/40 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#233B53]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#E99A78] transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="border-t border-[#233B53]/10 px-6 pb-5 pt-4 text-sm leading-relaxed text-[#332C28]/85 sm:text-[15px]"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
