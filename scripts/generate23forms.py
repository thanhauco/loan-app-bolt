from fpdf import FPDF
import os
import random
import zipfile

output_dir = "sba_mock_docs_full_realistic"
os.makedirs(output_dir, exist_ok=True)

def money(val):
    return "${:,.2f}".format(val)

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, self.title_text, 0, 1, 'C')
        self.ln(5)

    def add_table(self, data, col_widths=None, show_total=False):
        self.set_font('Arial', '', 12)
        total = 0
        for row in data:
            for i, item in enumerate(row):
                w = col_widths[i] if col_widths else 50
                self.cell(w, 8, str(item), border=1)
            self.ln()
            if show_total:
                try:
                    total += float(row[1].replace('$','').replace(',',''))
                except:
                    pass
        if show_total:
            self.set_font('Arial', 'B', 12)
            self.cell(sum(col_widths), 8, "Total: " + money(int(total)), border=1, ln=True)
            self.set_font('Arial', '', 12)

    def add_signature_line(self, label):
        self.ln(10)
        self.cell(0, 10, label + ": ______________________________", ln=True)

def create_pdf(filename, title, lines, tables=None, sig_lines=None):
    pdf = PDF()
    pdf.title_text = title
    pdf.add_page()
    for line in lines:
        pdf.multi_cell(0, 8, line)
    pdf.ln(5)
    if tables:
        for table, widths, show_total in tables:
            pdf.add_table(table, widths, show_total)
            pdf.ln(5)
    if sig_lines:
        for s in sig_lines:
            pdf.add_signature_line(s)
    path = os.path.join(output_dir, filename)
    pdf.output(path)
    return path

def generate_financial_table(items):
    table = []
    for item in items:
        value = random.randint(5000,500000)
        table.append([item, money(value)])
    return table

# --- List of 23 forms ---
forms = []

# 1-6: Business Docs
forms.append(("01_Business_License.pdf","Business License",["MockTech LLC licensed in Example State. License No: BL-{} Valid Jan 1, 2025 - Dec 31, 2025.".format(random.randint(10000000,99999999))], None, None))
forms.append(("02_Articles_of_Incorporation.pdf","Articles of Incorporation",["MockTech LLC formed under Example State law on Feb 15, 2020. Registered Agent: John Doe"], None, None))
forms.append(("03_Operating_Agreement.pdf","Operating Agreement",["Members: John Doe (60%), Jane Smith (40%). Ownership, voting, profit distribution, management responsibilities defined."], None, None))
forms.append(("04_Franchise_Agreement.pdf","Franchise Agreement",["Franchisor: ExampleFranchisor Inc.\nFranchisee: MockTech LLC\nTerm: 10 years\nFees: {} initial + 6% royalties\nTraining: 2 weeks\nTerritory: City of Exampleville\nTermination: Breach or insolvency".format(money(random.randint(20000,50000)))], None, None))
forms.append(("05_Lease_Agreement.pdf","Lease Agreement",["Landlord: Example Properties Inc.\nTenant: MockTech LLC\nPremises: 123 Main St, Exampleville\nTerm: 5 years starting Jan 1, 2025\nMonthly Rent: {}".format(money(random.randint(4000,7000)))], None, None))
forms.append(("06_Certificate_of_Good_Standing.pdf","Certificate of Good Standing",["Issued by Secretary of State, confirming MockTech LLC is active and compliant with state regulations."], None, None))

# 7-9: Financial Statements with tables
assets_table = generate_financial_table(["Cash","Accounts Receivable","Inventory","Equipment"])
liabilities_table = generate_financial_table(["Bank Loan","Accounts Payable"])
equity_table = generate_financial_table(["Owner Equity"])
forms.append(("07_Balance_Sheet.pdf","Balance Sheet",["Balance Sheet as of Dec 31, 2024"], [ ( [["ASSETS","Amount"]]+assets_table,[100,60],True ), ( [["LIABILITIES","Amount"]]+liabilities_table,[100,60],True ), ( [["EQUITY","Amount"]]+equity_table,[100,60],True ) ], ["Authorized Officer"]))

rev_table = generate_financial_table(["Product A","Product B","Product C"])
exp_table = generate_financial_table(["COGS","Salaries","Rent","Utilities","Marketing"])
forms.append(("08_Profit_and_Loss_Statement.pdf","Profit & Loss Statement",["P&L Statement 2024"], [ ( [["Revenue Item","Amount"]]+rev_table,[80,60],True ), ( [["COGS & Expenses","Amount"]]+exp_table,[80,60],True ) ], ["Authorized Officer"]))

cf_table = generate_financial_table(["Cash from Operations","Cash from Investing","Cash from Financing","Net Change"])
forms.append(("09_Cash_Flow_Statement.pdf","Cash Flow Statement",["Cash Flow Statement 2024"], [ ( [["Type","Amount"]]+cf_table,[100,60],True ) ], ["Authorized Officer"]))

# 10-12: Tax Returns and debt
forms.append(("10_Business_Tax_Returns.pdf","Business Tax Returns",["Business Tax Returns 2022-2024\nRevenue, expenses, taxable income populated with mock numbers."], None, ["Authorized Officer"]))
forms.append(("11_Personal_Tax_Returns.pdf","Personal Tax Returns",["Personal Tax Returns 2022-2024 for John Doe\nIncome and tax paid populated with mock numbers."], None, ["John Doe"]))
forms.append(("12_Schedule_of_Business_Debt.pdf","Schedule of Business Debt",["Creditor: MockBank\nBalance: {}\nInterest Rate: 5%\nMonthly Payment: {}".format(money(random.randint(100000,300000)), money(random.randint(2000,5000)))], None, ["Authorized Officer"]))

# 13-16: Personal info
personal_assets = generate_financial_table(["Cash","Investments","Property","Other Assets"])
personal_liabilities = generate_financial_table(["Credit Card","Loans","Other Liabilities"])
forms.append(("13_Personal_Financial_Statement.pdf","SBA Form 413",["John Doe Personal Financial Statement"], [ ( [["Assets","Amount"]]+personal_assets,[100,60],True ), ( [["Liabilities","Amount"]]+personal_liabilities,[100,60],True ) ], ["John Doe"]))
forms.append(("14_Personal_Resume.pdf","Personal Resume",["John Doe\nExperience: 15 years in software engineering and management.\nEducation: BS Computer Science, Example University"], None, None))
forms.append(("15_Personal_Identification.pdf","Personal Identification",["Driver's License: D1234567\nIssued: Example State\nDOB: Jan 1, 1980"], None, None))
forms.append(("16_Citizenship_Documents.pdf","Citizenship Documents",["Passport: Mock Passport #123456789\nUS Citizen"], None, None))

# 17-19: Loan Docs
forms.append(("17_SBA_Form_1919.pdf","SBA Form 1919",["Borrower Information for MockTech LLC\nRequested Loan: {}".format(money(random.randint(400000,600000)))], None, ["Authorized Officer"]))
forms.append(("18_SBA_Form_912.pdf","SBA Form 912",["Statement of Personal History for John Doe and Jane Smith (mock data)"], None, ["John Doe","Jane Smith"]))
forms.append(("19_Loan_Application_Form.pdf","Loan Application",["SBA 7(a) Loan Application\nRequested Amount: {}\nPurpose: Working capital and equipment\nTerm: 10 years\nInterest Rate: 6.5%".format(money(random.randint(400000,600000)))], None, ["Authorized Officer"]))

# 20-23: Credit, Collateral, Purchase, Equity
forms.append(("20_Credit_Elsewhere_Documentation.pdf","Credit Elsewhere Documentation",["Decline letters from 3 conventional lenders stating credit not available (mock data)"], None, ["Authorized Officer"]))
collateral_table = generate_financial_table(["Office Equipment","Commercial Property","Vehicles"])
forms.append(("21_Collateral_List.pdf","Collateral Documentation",None,[ ( [["Item","Value"]]+collateral_table,[100,60],True )], ["Authorized Officer"]))
forms.append(("22_Purchase_Agreement.pdf","Purchase Agreement",["Purchase Agreement for acquisition of ExampleCorp LLC.\nPurchase Price: {}".format(money(random.randint(200000,600000)))], None, ["Authorized Officer"]))
equity_table2 = generate_financial_table(["John Doe","Jane Smith","Other Investors"])
forms.append(("23_Equity_Injection_Proof.pdf","Equity Injection Proof",None,[ ( [["Investor","Amount"]]+equity_table2,[100,60],True )], ["Authorized Officer"]))

# Generate PDFs
pdf_files = []
for fname, title, lines, tables, sig_lines in forms:
    pdf_files.append(create_pdf(fname, title, lines if lines else [], tables, sig_lines))

# Zip all PDFs
zip_path = "sba_mock_docs_full_realistic.zip"
with zipfile.ZipFile(zip_path, 'w') as zipf:
    for pdf_file in pdf_files:
        zipf.write(pdf_file, os.path.basename(pdf_file))

print(f"All 23 SBA 7(a) PDFs generated with tables, totals, and signatures. Zipped at {zip_path}")
