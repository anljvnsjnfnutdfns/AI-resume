import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { type Resume } from "@shared/schema";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    marginBottom: 5,
    color: "#ffbb0a",
  },
  contact: {
    fontSize: 10,
    marginBottom: 3,
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: "#ffbb0a",
    borderBottomWidth: 1,
    borderBottomColor: "#ffbb0a",
    paddingBottom: 2,
  },
  sectionContent: {
    fontSize: 10,
    color: "#333",
  },
  experienceItem: {
    marginBottom: 10,
  },
  company: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  position: {
    fontSize: 11,
    fontStyle: "italic",
    marginBottom: 2,
  },
  dates: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
    paddingLeft: 10,
  },
  education: {
    marginBottom: 8,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skill: {
    fontSize: 10,
    backgroundColor: "#fff8e1",
    padding: 4,
    borderRadius: 3,
  },
});

interface PDFPreviewProps {
  data: Resume;
}

function ResumeDocument({ data }: PDFPreviewProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <Text style={styles.contact}>{data.personalInfo.email}</Text>
          <Text style={styles.contact}>
            {data.personalInfo.phone} | {data.personalInfo.location}
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.sectionContent}>{data.personalInfo.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.position}>{exp.position}</Text>
              <Text style={styles.dates}>
                {exp.startDate} - {exp.endDate} | {exp.location}
              </Text>
              {exp.description.map((desc, i) => (
                <Text key={i} style={styles.bullet}>
                  • {desc}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.education}>
              <Text style={styles.company}>{edu.school}</Text>
              <Text style={styles.position}>
                {edu.degree} in {edu.field}
              </Text>
              <Text style={styles.dates}>
                {edu.startDate} - {edu.endDate}
              </Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {data.skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default function PDFPreview({ data }: PDFPreviewProps) {
  return (
    <div className="h-[800px] w-full">
      <PDFViewer className="w-full h-full">
        <ResumeDocument data={data} />
      </PDFViewer>
    </div>
  );
}
