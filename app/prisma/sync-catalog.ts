import { PrismaClient } from "@prisma/client";
import { listings } from "../src/lib/data";
import {
  normalizeHighlights,
  normalizeStage,
  normalizeSummary,
} from "../src/lib/investment-evidence";
import { projectDocumentSources } from "../src/lib/project-documents";
import { relatedPartyMetadata } from "../src/lib/related-parties";

const prisma = new PrismaClient();
const SOURCE_MANAGED_IDS = new Set(listings.map((listing) => listing.id));
const CATALOG_IMPORT_VERSION = 2;

// Catalogue synchronisation for DESCO-managed public opportunities. Public
// narrative and disclosure fields follow the reviewed source catalogue on
// every deployment, while verification history and uploaded room material
// remain untouched.
async function main() {
  let created = 0;
  let refreshed = 0;

  for (const listing of listings) {
    const conflict = relatedPartyMetadata(listing.id);
    const existing = await prisma.listing.findUnique({
      where: { id: listing.id },
      select: { id: true, contentVersion: true },
    });

    if (existing) {
      // Once the reviewed import version has been applied, the database is
      // the source of truth. Deployments must not overwrite later editorial,
      // review or sponsor-approved changes with code literals.
      if (existing.contentVersion >= CATALOG_IMPORT_VERSION) {
        refreshed += 1;
        continue;
      }
      if (SOURCE_MANAGED_IDS.has(listing.id)) {
        const org = await prisma.organization.upsert({
          where: { name: listing.org },
          update: {},
          create: {
            name: listing.org,
            type: "seeker",
            country: listing.country,
          },
        });
        await prisma.listing.update({
          where: { id: listing.id },
          data: {
            orgId: org.id,
            title: listing.title,
            sector: listing.sector,
            sectorColor: listing.sectorColor,
            country: listing.country,
            flag: listing.flag,
            raiseUsd: listing.raiseUsd,
            instrument: listing.instrument,
            stage: normalizeStage(listing.stage),
            irr: listing.irr,
            summary: normalizeSummary(listing.id, listing.summary),
            useOfFunds: listing.useOfFunds,
            matchScore: listing.scores.match,
            readiness: listing.scores.readiness,
            esg: listing.scores.esg,
            risk: listing.scores.risk,
            highlights: JSON.stringify(normalizeHighlights(listing.highlights)),
            whyMatch: listing.whyMatch,
            publicationStatus: "public_teaser",
            contentVersion: CATALOG_IMPORT_VERSION,
            ...conflict,
          },
        });
        refreshed += 1;
        continue;
      }
      await prisma.listing.update({
        where: { id: listing.id },
        data: { sectorColor: listing.sectorColor },
      });
      refreshed += 1;
      continue;
    }

    const org = await prisma.organization.upsert({
      where: { name: listing.org },
      update: {},
      create: {
        name: listing.org,
        type: "seeker",
        country: listing.country,
      },
    });

    await prisma.listing.create({
      data: {
        id: listing.id,
        orgId: org.id,
        title: listing.title,
        sector: listing.sector,
        sectorColor: listing.sectorColor,
        country: listing.country,
        flag: listing.flag,
        raiseUsd: listing.raiseUsd,
        instrument: listing.instrument,
        stage: normalizeStage(listing.stage),
        irr: listing.irr,
        summary: normalizeSummary(listing.id, listing.summary),
        useOfFunds: listing.useOfFunds,
        verified: listing.verified,
        governmentBacked: listing.governmentBacked,
        matchScore: listing.scores.match,
        readiness: listing.scores.readiness,
        esg: listing.scores.esg,
        risk: listing.scores.risk,
        highlights: JSON.stringify(normalizeHighlights(listing.highlights)),
        whyMatch: listing.whyMatch,
        publicationStatus: "public_teaser",
        publishedAt: new Date(),
        contentVersion: CATALOG_IMPORT_VERSION,
        ...conflict,
      },
    });
    created += 1;
  }

  let indexedDocuments = 0;
  for (const source of projectDocumentSources) {
    const listingExists = await prisma.listing.findUnique({
      where: { id: source.listingId },
      select: { id: true },
    });
    if (!listingExists) continue;
    await prisma.document.upsert({
      where: {
        listingId_sourceRef: {
          listingId: source.listingId,
          sourceRef: source.sourceRef,
        },
      },
      update: {
        name: source.name,
        originalName: source.sourceRef.split("/").at(-1) ?? source.name,
        folder: source.folder,
        visibility: source.visibility,
        documentType: source.documentType,
        evidenceCategory: source.evidenceCategory,
        issuer: source.issuer,
        sourceDate: source.sourceDate ? new Date(`${source.sourceDate}T00:00:00.000Z`) : null,
        version: source.version,
        language: source.language ?? "en",
        reviewNote: source.reviewNote,
      },
      create: {
        listingId: source.listingId,
        sourceRef: source.sourceRef,
        name: source.name,
        originalName: source.sourceRef.split("/").at(-1) ?? source.name,
        size: "Source indexed",
        folder: source.folder,
        visibility: source.visibility,
        lifecycle: "reviewed",
        documentType: source.documentType,
        evidenceCategory: source.evidenceCategory,
        issuer: source.issuer,
        sourceDate: source.sourceDate ? new Date(`${source.sourceDate}T00:00:00.000Z`) : null,
        version: source.version,
        language: source.language ?? "en",
        reviewNote: source.reviewNote,
      },
    });
    indexedDocuments += 1;
  }

  console.log(`Catalogue synchronised: ${created} created, ${refreshed} refreshed, ${indexedDocuments} source documents indexed.`);
}

main().finally(() => prisma.$disconnect());
