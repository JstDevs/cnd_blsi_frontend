import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function VendorDetailsForm({ initialData, onSubmit, onClose, regionOptions = [], provinceOptions = [], municipalityOptions = [], barangayOptions = [], industryOptions = [], taxCodeOptions = [], vendorTypeOptions = [], paymentTermsOptions = [], modeOfPaymentOptions = [] }) {
  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    TIN: Yup.string().required('TIN is required'),
    Name: Yup.string().required('Name is required'),
    PhoneNumber: Yup.string().required('Phone number is required'),
    MobileNumber: Yup.string().required('Mobile number is required'),
    Email: Yup.string().email('Invalid email').required('Email is required'),
    Website: Yup.string().required('Website is required'),
    Region: Yup.string().required('Region is required'),
    Province: Yup.string().required('Province is required'),
    Municipality: Yup.string().required('Municipality is required'),
    Barangay: Yup.string().required('Barangay is required'),
    StreetAddress: Yup.string().required('Street address is required'),
    ZipCode: Yup.string().required('Zip code is required'),
    VendorType: Yup.string().required('Vendor type is required'),
    RevenueDistrictOffice: Yup.string().required('Revenue District Office is required'),
    Industry: Yup.string().required('Industry is required'),
    TaxCode: Yup.string().required('Tax code is required'),
    PaymentTerms: Yup.string().required('Payment terms are required'),
    Vatable: Yup.boolean(),
    ModeOfPayment: Yup.string().required('Mode of payment is required'),
    ContactPerson: Yup.string().required('Contact person is required'),
    DeliveryLeadTime: Yup.number().required('Delivery lead time is required').typeError('Must be a number'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      Code: '',
      TIN: '',
      Name: '',
      PhoneNumber: '',
      MobileNumber: '',
      Email: '',
      Website: '',
      Region: '',
      Province: '',
      Municipality: '',
      Barangay: '',
      StreetAddress: '',
      ZipCode: '',
      VendorType: '',
      RevenueDistrictOffice: '',
      Industry: '',
      TaxCode: '',
      PaymentTerms: '',
      Vatable: false,
      ModeOfPayment: '',
      ContactPerson: '',
      DeliveryLeadTime: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Code" name="Code" type="text" required {...formik} />
        <FormField label="TIN" name="TIN" type="text" required {...formik} />
      </div>

      {/* Row 2 */}
      <FormField label="Name" name="Name" type="text" required {...formik} />

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Phone Number" name="PhoneNumber" type="text" required {...formik} />
        <FormField label="Mobile Number" name="MobileNumber" type="text" required {...formik} />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email" name="Email" type="email" required {...formik} />
        <FormField label="Website" name="Website" type="text" required {...formik} />
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Region" name="Region" type="select" required options={regionOptions} {...formik} />
        <FormField label="Province" name="Province" type="select" required options={provinceOptions} {...formik} />
      </div>

      {/* Row 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Municipality" name="Municipality" type="select" required options={municipalityOptions} {...formik} />
        <FormField label="Barangay" name="Barangay" type="select" required options={barangayOptions} {...formik} />
      </div>

      {/* Row 7 */}
      <FormField label="Street Address" name="StreetAddress" type="textarea" required {...formik} />

      {/* Row 8 */}
      <FormField label="Zip Code" name="ZipCode" type="text" required {...formik} />

      <hr className="border-t border-neutral-300 my-4" />

      {/* Row 9 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Vendor Type" name="VendorType" type="select" required options={vendorTypeOptions} {...formik} />
        <FormField label="Revenue District Office" name="RevenueDistrictOffice" type="text" required {...formik} />
      </div>

      {/* Row 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Industry" name="Industry" type="select" required options={industryOptions} {...formik} />
        <FormField label="Tax Code" name="TaxCode" type="select" required options={taxCodeOptions} {...formik} />
      </div>

      {/* Row 11 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Payment Terms" name="PaymentTerms" type="select" required options={paymentTermsOptions} {...formik} />
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            name="Vatable"
            checked={values.Vatable}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <label htmlFor="Vatable">Vatable</label>
        </div>
      </div>

      {/* Row 12 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Mode of Payment" name="ModeOfPayment" type="select" required options={modeOfPaymentOptions} {...formik} />
        <FormField label="Contact Person" name="ContactPerson" type="text" required {...formik} />
      </div>

      {/* Row 13 */}
      <FormField
        label="Delivery Lead Time (days)"
        name="DeliveryLeadTime"
        type="number"
        required
        {...formik}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default VendorDetailsForm;
