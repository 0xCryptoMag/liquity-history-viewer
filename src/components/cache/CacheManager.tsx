import { useState } from 'react';
import { Tab, Tabs } from '../ui/Tab';
import { CacheViewer } from './CacheViewer';
import { CacheImportExport } from './CacheImportExport';
import { CacheDelete } from './CacheDelete';

type CacheSection = 'viewer' | 'importExport' | 'delete';

export function CacheManager() {
	const [section, setSection] = useState<CacheSection>('viewer');

	return (
		<div className='flex flex-col gap-4'>
			<Tabs value={section} onChange={setSection}>
				<Tab value='viewer'>Viewer</Tab>
				<Tab value='importExport'>Import/Export</Tab>
				<Tab value='delete'>Delete</Tab>
			</Tabs>
			{section === 'viewer' && <CacheViewer />}
			{section === 'importExport' && <CacheImportExport />}
			{section === 'delete' && <CacheDelete />}
		</div>
	);
}
